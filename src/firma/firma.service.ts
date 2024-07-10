import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import * as forge from 'node-forge';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class FirmaService {
    constructor(private readonly uploadService: UploadService, private readonly configService: ConfigService) { }
    async firma(p12Name: string, password: string, claveAcceso: string): Promise<String> {
        const s3Url = this.configService.getOrThrow('S3_BUCKET')
        const ARRAYBUFFER = await this.getP12(`${s3Url}certificados/${p12Name}`);
        let xml = await this.getXML(`${s3Url}xml/${claveAcceso}.xml`);
        xml = xml.replace(/\s+/g, ' ')
            .trim()
            .replace(/(?<=\>)(\r?\n)|(\r?\n)(?=\<\/)/g, '')
            .trim()
            .replace(/(?<=\>)(\s*)/g, '');
        const ARRAYUINT8 = new Uint8Array(ARRAYBUFFER);
        let B64 = forge.util.binary.base64.encode(ARRAYUINT8);
        const DER = forge.util.decode64(B64);
        const ASN1 = forge.asn1.fromDer(DER, { parseAllBytes: false });
        const P12 = forge.pkcs12.pkcs12FromAsn1(ASN1, password);
        const PKCS8BAGS = P12.getBags({
            bagType: forge.pki.oids.pkcs8ShroudedKeyBag
        });
        const cantidad = PKCS8BAGS[forge.oids.pkcs8ShroudedKeyBag].length - 1;
        const CERTBAGS = P12.getBags({
            bagType: forge.pki.oids.certBag
        });
        const CERTBAG = CERTBAGS[forge.pki.oids.certBag];
        const CERT = CERTBAG.length > 1 ? CERTBAG.reduce((prev, curr) => {
            return curr.cert.extensions.length > prev.cert.extensions.length ? curr : prev;
        }) : CERTBAG[0];
        const issuerAttributes = CERT.cert.issuer.attributes;
        let issuerName = issuerAttributes.reverse().map(attr => {
            return `${attr.shortName}=${attr.value}`;
        }).join(',');
        if (issuerName.indexOf('UANATACA') > -1) {
            const splitted = issuerName.split(',');
            splitted[0] = '2.5.4.97=#0c0f56415445532d413636373231343939'
            issuerName = splitted.join(',');
        }
        const pkcs8 = PKCS8BAGS[forge.oids.pkcs8ShroudedKeyBag][cantidad];
        const key = pkcs8.key ?? pkcs8.asn1;
        const certificate = CERT.cert;
        const certificateX509_serialNumber = await this.getCertificateEncoded(certificate.serialNumber);
        const certificateX509_pem = forge.pki.certificateToPem(certificate);
        let certificateX509 = certificateX509_pem.substring(
            certificateX509_pem.indexOf('\n') + 1,
            certificateX509_pem.indexOf('\n-----END CERTIFICATE-----')
        );

        certificateX509 = certificateX509
            .replace(/\r?\n|\r/g, '')
            .replace(/([^\0]{76})/g, '$1\n');

        const certificateX509_asn1 = forge.pki.certificateToAsn1(certificate);
        const certificateX509_der = forge.asn1.toDer(certificateX509_asn1).getBytes();
        const certificateX509_der_hash = this.sha1_base64(certificateX509_der);

        const exponent = this.hexToBase64(key.e.data[0].toString(16));
        const modulus = this.bigIntToBase64(key.n);

        xml = xml.replace(/\t|\r/g, '');

        const sha1_xml = this.sha1_base64(
            xml.replace('<?xml version="1.0" encoding="UTF-8"?>\n', ''),
            'utf8'
        );

        const namespaces = 'xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"';

        const Certificate_number = this.getRandomNumber();

        const Signature_number = this.getRandomNumber();

        const SignedProperties_number = this.getRandomNumber();

        const SignedInfo_number = this.getRandomNumber();

        const SignedPropertiesID_number = this.getRandomNumber();

        const Reference_ID_number = this.getRandomNumber();

        const SignatureValue_number = this.getRandomNumber();

        const Object_number = this.getRandomNumber();

        const currentDate = new Date();

        const isoDateTime = currentDate.toISOString().slice(0, 19);
        // const decodedd = serialNumber.toString()

        let SignedProperties = '';
        SignedProperties += '<etsi:SignedProperties Id="Signature' + Signature_number + '-SignedProperties' + SignedProperties_number + '">'; //SignedProperties
        SignedProperties += '<etsi:SignedSignatureProperties>';
        SignedProperties += '<etsi:SigningTime>';

        SignedProperties += isoDateTime;

        SignedProperties += '</etsi:SigningTime>';
        SignedProperties += '<etsi:SigningCertificate>';
        SignedProperties += '<etsi:Cert>';
        SignedProperties += '<etsi:CertDigest>';
        SignedProperties += '<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
        SignedProperties += '</ds:DigestMethod>';
        SignedProperties += '<ds:DigestValue>';

        SignedProperties += certificateX509_der_hash;

        SignedProperties += '</ds:DigestValue>';
        SignedProperties += '</etsi:CertDigest>';
        SignedProperties += '<etsi:IssuerSerial>';
        SignedProperties += '<ds:X509IssuerName>';

        SignedProperties += issuerName;

        SignedProperties += '</ds:X509IssuerName>';
        SignedProperties += '<ds:X509SerialNumber>';

        SignedProperties += certificateX509_serialNumber;

        SignedProperties += '</ds:X509SerialNumber>';
        SignedProperties += '</etsi:IssuerSerial>';
        SignedProperties += '</etsi:Cert>';
        SignedProperties += '</etsi:SigningCertificate>';
        SignedProperties += '</etsi:SignedSignatureProperties>';
        SignedProperties += '<etsi:SignedDataObjectProperties>';
        SignedProperties += '<etsi:DataObjectFormat ObjectReference="#Reference-ID-' + Reference_ID_number + '">';
        SignedProperties += '<etsi:Description>';

        SignedProperties += 'contenido comprobante';

        SignedProperties += '</etsi:Description>';
        SignedProperties += '<etsi:MimeType>';
        SignedProperties += 'text/xml';
        SignedProperties += '</etsi:MimeType>';
        SignedProperties += '</etsi:DataObjectFormat>';
        SignedProperties += '</etsi:SignedDataObjectProperties>';
        SignedProperties += '</etsi:SignedProperties>';

        const sha1_signedProperties = this.sha1_base64(
            SignedProperties.replace('<etsi:SignedProperties', '<etsi:SignedProperties ' + namespaces)
        );

        let KeyInfo = '';

        KeyInfo += '<ds:KeyInfo Id="Certificate' + Certificate_number + '">';
        KeyInfo += '\n<ds:X509Data>';
        KeyInfo += '\n<ds:X509Certificate>\n';

        //CERTIFICADO X509 CODIFICADO EN Base64 
        KeyInfo += certificateX509;

        KeyInfo += '\n</ds:X509Certificate>';
        KeyInfo += '\n</ds:X509Data>';
        KeyInfo += '\n<ds:KeyValue>';
        KeyInfo += '\n<ds:RSAKeyValue>';
        KeyInfo += '\n<ds:Modulus>\n';

        //MODULO DEL CERTIFICADO X509
        KeyInfo += modulus;

        KeyInfo += '\n</ds:Modulus>';
        KeyInfo += '\n<ds:Exponent>\n';

        //KeyInfo += 'AQAB';
        KeyInfo += exponent;

        KeyInfo += '</ds:Exponent>';
        KeyInfo += '\n</ds:RSAKeyValue>';
        KeyInfo += '\n</ds:KeyValue>';
        KeyInfo += '\n</ds:KeyInfo>';

        const sha1_keyInfo = this.sha1_base64(
            KeyInfo.replace('<ds:KeyInfo', '<ds:KeyInfo ' + namespaces)
        );

        let SignedInfo = '';

        SignedInfo += '<ds:SignedInfo Id="Signature-SignedInfo' + SignedInfo_number + '">';
        SignedInfo += '\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315">';
        SignedInfo += '</ds:CanonicalizationMethod>';
        SignedInfo += '\n<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1">';
        SignedInfo += '</ds:SignatureMethod>';
        SignedInfo += '\n<ds:Reference Id="SignedPropertiesID' + SignedPropertiesID_number + '" Type="http://uri.etsi.org/01903#SignedProperties" URI="#Signature' + Signature_number + '-SignedProperties' + SignedProperties_number + '">';
        SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
        SignedInfo += '</ds:DigestMethod>';
        SignedInfo += '\n<ds:DigestValue>';

        //HASH O DIGEST DEL ELEMENTO <etsi:SignedProperties>';
        SignedInfo += sha1_signedProperties;

        SignedInfo += '</ds:DigestValue>';
        SignedInfo += '\n</ds:Reference>';
        SignedInfo += '\n<ds:Reference URI="#Certificate' + Certificate_number + '">';
        SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
        SignedInfo += '</ds:DigestMethod>';
        SignedInfo += '\n<ds:DigestValue>';

        //HASH O DIGEST DEL CERTIFICADO X509
        SignedInfo += sha1_keyInfo;

        SignedInfo += '</ds:DigestValue>';
        SignedInfo += '\n</ds:Reference>';
        SignedInfo += '\n<ds:Reference Id="Reference-ID-' + Reference_ID_number + '" URI="#comprobante">';
        SignedInfo += '\n<ds:Transforms>';
        SignedInfo += '\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature">';
        SignedInfo += '</ds:Transform>';
        SignedInfo += '\n</ds:Transforms>';
        SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
        SignedInfo += '</ds:DigestMethod>';
        SignedInfo += '\n<ds:DigestValue>';

        //HASH O DIGEST DE TODO EL ARCHIVO XML IDENTIFICADO POR EL id="comprobante" 
        SignedInfo += sha1_xml;

        SignedInfo += '</ds:DigestValue>';
        SignedInfo += '\n</ds:Reference>';
        SignedInfo += '\n</ds:SignedInfo>';

        const SignedInfo_para_firma = SignedInfo.replace('<ds:SignedInfo', '<ds:SignedInfo ' + namespaces);

        let md = forge.md.sha1.create();
        md.update(SignedInfo_para_firma, 'utf8');

        const signature = btoa(key.sign(md)).match(/.{1,76}/g).join("\n");

        let xades_bes = '';

        //INICIO DE LA FIRMA DIGITAL 
        xades_bes += '<ds:Signature ' + namespaces + ' Id="Signature' + Signature_number + '">';
        xades_bes += '\n' + SignedInfo;

        xades_bes += '\n<ds:SignatureValue Id="SignatureValue' + SignatureValue_number + '">\n';

        //VALOR DE LA FIRMA (ENCRIPTADO CON LA LLAVE PRIVADA DEL CERTIFICADO DIGITAL) 
        xades_bes += signature;

        xades_bes += '\n</ds:SignatureValue>';

        xades_bes += '\n' + KeyInfo;

        xades_bes += '\n<ds:Object Id="Signature' + Signature_number + '-Object' + Object_number + '">';
        xades_bes += '<etsi:QualifyingProperties Target="#Signature' + Signature_number + '">';

        //ELEMENTO <etsi:SignedProperties>';
        xades_bes += SignedProperties;

        xades_bes += '</etsi:QualifyingProperties>';
        xades_bes += '</ds:Object>';
        xades_bes += '</ds:Signature>';

        let signed = xml.replace(/(<[^<]+)$/, xades_bes + '$1');
        await this.uploadService.upload(`firmados/${claveAcceso}.xml`, Buffer.from(signed));

        // return signed;
        return Buffer.from(signed, 'utf8').toString('base64');
    }

    async getCertificateEncoded(serialNumer: string): Promise<string | undefined> {
        // let encodedString = undefined;
        const response = await fetch(`https://zclvzvwfm5.execute-api.us-east-1.amazonaws.com/default/getHexSerialNumber?serialNumber=${serialNumer}`);
        const data = await response.json();
        return data.encodedSerial;
    }

    async getP12(path: string): Promise<ArrayBuffer> {
        const RESPONSE = await fetch(path);
        if (!RESPONSE.ok) {
            throw new Error(`Error al obtener el certificado: ${RESPONSE.status} ${RESPONSE.statusText}`);
        }
        const DATA = await RESPONSE.arrayBuffer();
        return DATA;
    }

    async getXML(path: string) {
        const RESPONSE = await fetch(path);
        if (!RESPONSE.ok) {
            throw new Error(`Error al obtener el xml: ${RESPONSE.status} ${RESPONSE.statusText}`);
        }
        const DATA = await RESPONSE.text();
        return DATA;
    }

    sha1_base64(txt: string, encoding?: forge.Encoding): string {
        let md = forge.md.sha1.create();
        md.update(txt, encoding);

        const HASH = md.digest().toHex();
        const BUFFER = Buffer.from(HASH, 'hex');
        const BASE64 = BUFFER.toString('base64');
        return BASE64;
    }

    hexToBase64(hexStr: string): string {
        hexStr = hexStr.padStart(hexStr.length + (hexStr.length % 2), '0');
        const BYTES = hexStr.match(/.{2}/g).map(byte => parseInt(byte, 16));
        return btoa(String.fromCharCode(...BYTES));
    }

    bigIntToBase64(bigint: number): string {
        const HEXSTRING = bigint.toString(16);
        const HEXPAIRS = HEXSTRING.match(/\w{2}/g);
        const BYTES = HEXPAIRS.map(pair => parseInt(pair, 16));
        const BYTESTRING = String.fromCharCode(...BYTES);
        const BASE64 = btoa(BYTESTRING);
        const FORMATEDBASE64 = BASE64.match(/.{1,76}/g).join('\n');
        return FORMATEDBASE64;
    }

    getRandomNumber(min: number = 990, max: number = 9999): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
