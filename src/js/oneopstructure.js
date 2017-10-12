
OneOpStructure = function(s)
{
  this.set = s;
  this.name = "?";
  this.getName = function(){ return this.name;};

  this.opStr = "(a+b)%n";
  this.setOpStr = function(str) {
    this.opStr = str;
    this.calculateTable();
  };
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

      this.calculateTable();
   };

   this.calculateTable = function() {
     this.t = Array(this.set.n);
     for(var i=0; i<this.set.n; i++)
      {
        this.t[this.set.e[i]] = Array(this.set.n);
        for(var j=0; j<this.set.n; j++)
          this.t[this.set.e[i]][this.set.e[j]] = this.op(this.set.e[i],this.set.e[j]);
      }
   }


   this.calculateExpression = function(str) {

     jsep.addBinaryOp(this.opSymbol,9);
     try
     {
       var ast = jsep(str);
       return this.evaluateNode(ast);
     }
     catch(e)
     {
       return '<span class="error">'+e+"</span>";
     }
   }

   this.evaluateNode = function(node)
   {
     if(node.hasOwnProperty("value"))
     {
       if(!this.set.e.includes(node.value))
        throw node.value+" ∉ "+this.set.getSymbol(true);
      return node.value;
     }

     if(node.type == "UnaryExpression")
     {
       return node.argument.value;
     }
     if(node.type == "BinaryExpression")
     {
       var left = this.evaluateNode(node.left);
       var right = this.evaluateNode(node.right);
       return this.t[left][right];
     }
   }

};
