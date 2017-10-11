
OneOpStructure = function(s)
{
  this.set = s;
  this.name = "?";
  this.getName = function(){ return this.name;};

  this.opStr = "(a+b)%n";
  this.opSymbol="⊕";
  this.setOpSymbol= function(symbol){
    if(symbol.length > 0)
      this.opSymbol = symbol;
  }
  this.t = [];


  this.op = function(a,b,n=this.set.n)
  {
    return eval(this.opStr);
  };

   this.toString = function(){
     return this.name + " = ("+this.set.getSymbol()+","+this.opSymbol+")";
   };

   this.setElements = function(elements) {
     this.set.setElements(elements);

     this.t = Array(this.set.n);
     for(var i=0; i<this.set.n; i++)
      {
        this.t[i] = Array(this.set.n);
        for(var j=0; j<this.set.n; j++)
          this.t[i][j] = this.op(i,j);
      }
   };

};
