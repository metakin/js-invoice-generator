import JsBarcode from 'jsbarcode';
import _, { reject } from 'lodash';
import qrCode from 'qrcode';
import { DOMImplementation, XMLSerializer } from 'xmldom';

export default class {
	static mapToItem(arr) {
		return _.map(arr, elem => ({ name: elem.name || null, qty: elem.qty || null, price: elem.price || null }));
	}
	static mapToTaxes(arr) {
		return _.map(arr, elem => ({ name: elem.name || null, percent: elem.percent || null }));
	}
	static mapToCharges(arr) {
		return _.map(arr, elem => ({ name: elem.name || null, price: elem.price || null }));
	}
	static calcSubTotal(arr) {
		return _.sum(_.map(arr, elem => parseFloat(elem.price)));
	}
	static calcTotal(arr) {
		return _.sum(_.map(arr, elem => parseFloat(elem.price)));
	}
	static calcTaxes(arr, sub_total) {
		return _.map(arr, elem => {
			elem.price = (sub_total * (elem.percent / 100)).toFixed(2);
			return elem;
		});
	}
	static async generateQr(text) {
		return new Promise((resolve, reeject) => {
			qrCode.toString(
				text,
				{
					type: 'svg',
					margin: 0
				},
				(err, string) => {
					reject(err);
					resolve(string);
				}
			);
		});
	}

	static generateBarcode(text) {
		const xmlSerializer = new XMLSerializer();
		const doc = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
		const svgNode = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
		JsBarcode(svgNode, text, {
			xmlDocument: doc,
			height: 20,
			textMargin: 0,
			width: 1
		});
		const svgText = xmlSerializer.serializeToString(svgNode);
		return svgText;
	}

	static async getRemoteTemplate(url) {
		return new Promise((resolve, reject) => {
			fetch(url)
				.then(response => response.text())
				.then(html => resolve(html))
				.catch(err => reject(err));
		});
	}
}
