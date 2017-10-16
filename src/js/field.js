
Field = function(s)
{
  this.set = s;
  this.name = "?";
  this.getName = function(){ return this.name;};

  this.ops = [];//op2===false ? [op] : [op,op2];
  this.hasTwoOperations = function() {return this.ops.length>1; };

  this.isDistributive = false;
  this.isRing = false;
  this.isRingWith1 = false;
  this.isDivisionring = false;
  this.isField = false;
  this.isNullring = false;

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
    this.analyzeStructure();
   };


   this.updateAnnulator = function() {
     if(this.hasTwoOperations() && this.ops[1].annullator !== this.ops[0].neutralElement)
     {
       this.ops[1].annullator = this.ops[0].neutralElement;
       this.ops[1].analyzeStructure();
     }
   }

   this.testDistributive = function() {
     var s = this.set;
     for(var i=0; i<s.n; i++)
       for(var j=0; j<s.n; j++)
         for(var k=0; k<s.n; k++)
           if( ! (this.ops[1].map(this.set.e[i],this.ops[0].map(j,k,true)) == this.ops[0].map(this.ops[1].map(i,j,true),this.ops[1].map(i,k,true))) &&
                 (this.ops[1].map(this.ops[0].map(i,j,true),this.set.e[k]) == this.ops[0].map(this.ops[1].map(i,k,true),this.ops[1].map(j,k,true)))  )
             return [s.e[i],s.e[j],s.e[k]];
     return true;
   };

   this.analyzeStructure = function() {
     if(this.hasTwoOperations())
     {
       this.isNullring = this.set.n == 1;
       this.isDistributive = this.testDistributive() === true;
       this.isRing = this.isDistributive && this.ops[0].isGroup && this.ops[1].isSemigroup;
       this.isRingWith1 = this.isDistributive && this.ops[0].isGroup && this.ops[1].isMonoid;
       this.isDivisionring = this.isDistributive && this.ops[0].isGroup && this.ops[1].isMonoid && this.ops[1].hasInverse;
       this.isField = this.isDistributive && this.ops[0].isGroup && this.ops[0].isCommutative && this.ops[1].isGroup && this.ops[1].isCommutative && !this.isNullring;
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
