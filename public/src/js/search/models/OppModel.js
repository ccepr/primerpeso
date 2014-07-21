module.exports = function (Backbone, _, SearchShop) {
  return Backbone.Model.extend({
    defaults: {
      title: '',
    },
    // Increase or decrease the quantity
    quanity : function( type ) {
      var qty = this.get('quantity');
      this.set('quantity', (type === 'increase' ? ++qty : --qty) );
    }
  });
}