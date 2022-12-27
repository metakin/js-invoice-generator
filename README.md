# Motion - Invoice and Receipt Generator

Motion is a JavaScript library for generating invoices and receipts. It is built with webpack and is suitable for use in web applications.

## Installation

To install Motion, simply download the library and include it in your project.

```html
<script src="path/to/motion.min.js"></script>
```
## Usage

To generate an invoice or receipt, you need to create a new instance of the `motion` class and pass it a selector and options object.

```javascript
var invoice = new motion('#invoice', {
  shop_name: 'Test Restaurant',
  logo: 'https://i.imgur.com/TqonQrC.png',
  email_address: 'store@example.com',
  phone_number: '222 222 222',
  footer_message: 'Have a nice day!',
  items: [
    { name: 'Pizza', qty: 1, price: 18 },
    { name: 'Cola', qty: 2, price: 4 }
  ],
  custom_fields: {
    extra_message: 'Extra Message'
  },
  taxes: [
    { name: 'Tax A', percent: 8 },
    { name: 'Tax B', percent: 2 }
  ],
  charges: [
    { name: 'Delivery Fee', price: 8 }
  ],
  barcode: 100000000009,
  qr: 'My Invoice'
});
```

To render the invoice or receipt, call the `prepare` method.

```javascript
invoice.prepare();
```


# Options

| Option           | Default Value | Type      | Example                             |
| ---------------- | ------------- | --------- | ----------------------------------- |
| selector         | ''            | String    | '#id' or '.class_name'             |
| options          | {}            | Object    | { shop_name: 'Test Restaurant' }   |
| currency         | $             | String    | €                                  |
| reference_no     | ''            | String    | 9011                               |
| remote_html      | false         | Boolean   | true                               |
| logo             | ''            | String    | 'https://example.com/logo.png'    |
| footer_message   | ''            | String    | 'Thank you'                        |
| email_address    | ''            | String    | 'shop@example.com'                |
| shop_address     | ''            | String    | 'Abc Street'                       |
| phone_number     | false         | Boolean   | '(222) 22 22 222'                 |
| fax_number       | false         | Boolean   | '(222) 22 22 222'                 |
| items            | []            | Array     | [ { name: 'Food name', qty: 1, price: 50.00 } ] |
| taxes            | []            | Array     | [ { name: 'Tax name', percent: 10 } ] |
| charges          | []            | Array     | [ { name: 'Charge name', price: 3.00 } ] |
| qr               | false         | Boolean   | true                               |
| barcode          | false         | Boolean   | 919992                             |
| receipt_time     | ''            | String    |                                     |
| custom_fields    | {}            | JSON      | { extra_message: 'Extra Message' }, Custom fields for custom remote templates |

# Methods

#### `.addItem(ItemObject)`

| Type     | Example                 |
| -------- | ------------------------ |
| ItemObject | {name: 'Ice Cream', qty: 3, price: 2} |

#### `.addTax(TaxName, TaxPercent)`

| Type     | Example         |
| -------- | --------------- |
| TaxName  | 'Tax A'         |
| TaxPercent | 18              |

#### `.addCharge(ChargeName, ChargeFee)`

| Type     | Example         |
| -------- | --------------- |
| ChargeName | 'Charge A'      |
| ChargeFee | 18              |

#### `.toHTML(callback: Function)`

This method is used to generate the HTML template of the invoice. It takes a callback function as a parameter and returns the HTML template as a string.

```javascript
invoice.toHTML(function(html) {
    console.log(html);
});
```

# Custom Remote Template

To use a custom remote template, you need to set the remote_template option to the url of your template file. Then, you can use placeholders in your template file to render dynamic data.

```html
<!-- custom.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Custom Receipt Template</title>
  </head>
  <body>
    <h1>{{shop_name}}</h1>
    <p>Reference No: {{reference_no}}</p>
    <ul>
      {{#items}}
      <li>{{name}} - {{qty}} x {{currency}}{{price}}</li>
      {{/items}}
    </ul>
    <p>Subtotal: {{currency}}{{sub_total}}</p>
    <p>Total: {{currency}}{{total}}</p>
  </body>
</html>
```

```javascript
var invoice = new motion(selector, {
  remote_template: 'https://example.com/custom.html',
  shop_name: 'Test Restaurant',
  reference_no: '9011',
  items: [
    { name: 'Food name', qty: 1, price: 50.00 },
  ],
});
```

Note: If you are using a remote template, you need to make sure that the server where the template is hosted allows [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORShttp:// "CORS") requests from your website.


