
Field = function(s,op)
{
  this.set = s;
  this.name = "?";
  this.getName = function(){ return this.name;};

  this.ops = [op];

  this.OpBySymbol = function(symbol,inv=false) {
    for(var i=0; i<this.ops.length; i++)
      if( (!inv && this.ops[i].symbol == symbol) || (inv && this.ops[i].inverseSymbol == symbol) )
        return this.ops[i];
    return undefined;
  }

   this.toString = function(){
     return this.name + " = ("+this.set.getSymbol()+","+this.ops.join(",")+")";
   };

   this.setElements = function(elements) {
     this.set.setElements(elements);
     this.ops[0].regenerateTable();
   };


   this.calculateExpression = function(str) {
     jsep.addBinaryOp(this.ops[0].symbol,9);
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
       var op = this.OpBySymbol(node.operator,true);

         var inv = op.inv[parseInt(node.argument.value)];
         if(typeof node.argument.value === "undefined")
          throw "Ungültiger Ausdruck";
          else if(!this.set.e.includes(node.argument.value))
           throw node.argument.value+" ∉ "+this.set.getSymbol(true);
         else if(typeof inv === "undefined")
          throw "Inverses Element zu "+node.argument.value+" existiert nicht";
        else
          return inv;
     }
     if(node.type == "BinaryExpression")
     {
       var op = this.OpBySymbol(node.operator);
       if(!op)
        throw "Unbekannter Operator "+node.operator;

       var left = this.evaluateNode(node.left);
       var right = this.evaluateNode(node.right);

       return op.map(left, right);
     }
   }

};
