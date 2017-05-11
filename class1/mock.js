
const vendors = [];
const customers = [];
const sales = [];
const names = ['Pepe', 'Luis', 'Carlos', 'Miguel'];
const lnames = ['Rodriguez', 'Casas', 'Perez', 'Suarez'];
const countries = ['USA', 'BR', 'ARG', 'MX', 'JPG'];
const letters = ['AK', 'CK', 'N', 'SK'];


const getRandomName = data => data[ Math.floor(Math.random()* data.length) ];

const generateVendors = total => {
  for(let x=0; x<total; x++) vendors.push({
    Id: Math.floor(Math.random()* 3000),
    fname: getRandomName(names),
    lname: getRandomName(lnames),
  });
}

const generateCustomers = total => {
  for(let x=0; x<total; x++) customers.push({ // x 1000
    Id: Math.floor(Math.random()*10000),
    fname: getRandomName(names),
    lname: getRandomName(lnames),
    passport: Math.floor(Math.random()*1000000)+getRandomName(letters),
    country: getRandomName(countries),
  });
}


const generateSales = limit =>{
  for(let x=0; x<limit; x++) sales.push({
    date: new Date(),
    vendorId: getRandomName(vendors).Id,
    customerId: getRandomName(customers).Id,
    flyId: 'KML102',
    price: (Math.random() * 1000) + 1
  });
}
generateVendors(500);
generateCustomers(1000);
generateSales(100000);

const mySales = {
  vendors: vendors,
  customers: customers,
  sales: sales
};

class Results {
  constructor(results){
    this.data = results;
  }

  currency(sym, value){
    this.data = this.data.map(e => {
      e[sym] = e.price * value;
      return e;
    });
    return this;
  }

  eq(prop, value){
    this.data  = this.data.filter(e => e[prop] === value);
    return this;
  }

  not(prop, value){
    this.data  = this.data.filter(e => e[prop] !== value);
    return this;
  }

  r(prop, value){
    this.data = this.data.filter( e => e[prop] > value);
    return this;
  }

  l(prop, value){
    this.data = this.data.filter( e => e[prop] < value);
    return this;
  }

  in(prop, value){
    this.data = this.data.filter(e => value.indexOf(e[prop]) > -1 ? true: false );
    return this;
  }

  nin(prop, value){
    this.data = this.data.filter(e => value.indexOf(e[prop]) === -1 ? true: false );
    return this;
  }
}


const myResults  = new Results(mySales.sales);

console.log( myResults.r('price', 500)
                      .l('vendorId', 2000)
                      .currency('ARG', 15)
                      .currency('MX', 18)
                      .nin('price', [500, 501])
                      .l('ARG', 10000)
                      .data.length);
