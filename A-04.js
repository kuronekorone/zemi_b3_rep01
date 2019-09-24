var price= 12300;
document.write('<p>価格' + price + '円</p>');
const tax = 0.08;
price= price* (1.0+ tax);
document.write('<p>税込価格:' + price + '円</p>');
