
Field = function(s)
{
  this.set = s;
  this.name = "?";
  this.getName = function(){ return this.name;};

  this.ops = [];//op2===false ? [op] : [op,op2];
  this.hasTwoOperations = function() {return this.ops.length>1; };

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
     for(var i=0; i<this.ops.length; i++)
      this.ops[i].regenerateTable();
    this.updateAnnulator();
   };


   this.updateAnnulator = function() {
     if(this.hasTwoOperations() && this.ops[1].annullator !== this.ops[0].neutralElement)
     {
       this.ops[1].annullator = this.ops[0].neutralElement;
       this.ops[1].analyzeStructure();
     }
   }


   this.calculateExpression = function(str)
   {
     if(str.trim().length < 1)
      return "";

     jsep.binary_ops = [];
     jsep.unary_ops=[];
     for(var i=0; i<this.ops.length; i++)
     {
       jsep.addBinaryOp(this.ops[i].symbol,9+i);
       jsep.addUnaryOp(this.ops[i].inverseSymbol);
    }

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

        var exp = this.evaluateNode(node.argument);

         var inv = op.inv[exp];

         if(typeof inv === "undefined")
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
