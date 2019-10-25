"# odin-inventory-application" 

// price validation using regex for item mongoose
if ( req.body.price ) {
    req.assert('price', 'Enter a price (numbers only)').regex(/^\d+(\.\d{2})?$/);
}