import _ from 'lodash';
import mustache from 'mustache';
import helper from './helper';
import Item from './item';
import Tax from './tax';
import Charge from './charge';

import defaultTemplate from './template/default.html';
export default class {
	constructor(selector = null, options = {}) {
		this.selector = selector;
		this.items = [];
		this.qr = options.qr || false;
		this.barcode = options.barcode || false;
		this.logo = options.logo || false;
		this.shop_name = options.shop_name || false;
		this.shop_address = options.shop_address || false;
		this.reference_no = options.reference_no || false;
		this.receipt_time = options.receipt_time || new Date().toLocaleString();
		this.phone_number = options.phone_number || false;
		this.fax_number = options.phone_number || false;
		this.email_address = options.email_address || false;
		this.footer_message = options.footer_message || false;
		this.remote_template = options.remote_template || false;
		this.currency = options.currency || '$';
		this.taxes = [];
		this.charges = [];
		this.custom_fields = options.custom_fields || {};
		_.map(helper.mapToItem(options.items), elem => this.addItem(elem));
		_.map(helper.mapToTaxes(options.taxes), elem => this.addTax(elem.name, elem.percent));
		_.map(helper.mapToCharges(options.charges), elem => this.addCharge(elem.name, elem.price));
	}
	/**
	 *
	 * @param {Object} item
	 * @param {string} item.name Product name
	 * @param {number} item.qty Quantity
	 * @param {price} item.price Product price
	 */
	addItem({ name, qty, price }) {
		if (typeof qty !== 'number') throw new Error('QTY must be a number.');
		if (typeof price !== 'number') throw new Error('Price must be a number.');
		this.items.push(new Item(name, qty, price));
	}
	/**
	 *
	 * @param {string} name Tax name
	 * @param {number} percent Percentage of tax
	 */
	addTax(name, percent) {
		if (typeof percent !== 'number') throw new Error('Percent must be a number.');
		this.taxes.push(new Tax(name, percent));
	}
	/**
	 *
	 * @param {string} name Charge name
	 * @param {number} percent Price of charge
	 */
	addCharge(name, price) {
		if (typeof price !== 'number') throw new Error('Price must be a number.');
		this.charges.push(new Charge(name, price));
	}

	async toHTML(callback) {
		let sub_total = helper.calcSubTotal(this.items);
		let taxes = helper.calcTaxes(this.taxes, sub_total);
		let total = helper.calcTotal([...this.items, ...this.taxes, ...this.charges]).toFixed(2);
		let receiptTemplate = defaultTemplate;
		if (this.remote_template) {
			receiptTemplate = await helper.getRemoteTemplate(this.remote_template);
		}
		let output = mustache.render(
			receiptTemplate,
			Object.assign(
				{
					items: this.items,
					sub_total,
					total,
					taxes,
					charges: this.charges,
					currency: this.currency,
					shop_name: this.shop_name,
					shop_address: this.shop_address,
					email_address: this.email_address,
					fax_number: this.fax_number,
					phone_number: this.phone_number,
					reference_no: this.reference_no,
					logo: this.logo,
					receipt_time: this.receipt_time,
					footer_message: this.footer_message,
					...(this.qr && { qr: await helper.generateQr(this.qr) }),
					...(this.barcode && { barcode: helper.generateBarcode(this.barcode) })
				},
				this.custom_fields
			)
		);
		callback(output);
	}
	async prepare() {
		this.toHTML(output => {
			document.querySelector(this.selector).innerHTML = output;
		});
	}
}
