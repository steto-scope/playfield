
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

      this.op1ne = this.determineOp1ne();
      for(var i=0; i<this.set.n; i++)
      {
        this.inv[this.set.e[i]] = this.inverseOp1(this.set.e[i]);
      }
   };

   this.testOp1Assoc = function() {
 		for(var i=0; i<this.set.n; i++)
 			for(var j=0; j<this.set.n; j++)
 				for(var k=0; k<this.set.n; k++)
 					if(this.t[this.t[this.set.e[i]][this.set.e[j]]][this.set.e[k]] != this.t[this.set.e[i]][this.t[this.set.e[j]][this.set.e[k]]])
 						return [this.set.e[i],this.set.e[j],this.set.e[k]];
 		return true;
 	},
  this.testInner = function() {
    for(var i=0; i<this.set.n; i++)
 			for(var j=0; j<this.set.n; j++)
        if(!this.set.includes(this.t[this.set.e[i]][this.set.e[j]]))
          return this.t[this.set.e[i]][this.set.e[j]];
    return true;
  }


  this.isMagma = false;
  this.isAssoc = false;
  this.isMonoid = false;
  this.isSemigroup = false;

  this.determineStructure = function() {

  }

   this.op1ne = false;
   this.determineOp1ne = function()
   	{
   		for(var i=0; i<this.set.n; i++)
   		{
   				var ok=true;
   				for(var k=0; k<this.set.n; k++)
   					if(!(this.t[this.set.e[k]][this.set.e[i]] == this.set.e[k] && this.t[this.set.e[i]][this.set.e[k]] == this.set.e[k]))
   						{
   							ok = false;
   							break;
   						}
   				if(ok)
   					return this.set.e[i];
   			}
   			return false;
   	},
    this.hasOp1Ne = function() { return this.op1ne !== false; }

    this.inv = [];
    this.inverseOp1 = function(element) {
      if(!this.set.e.includes(element))
        return undefined;

      var li = Array();
      for(var i=0; i<this.set.n; i++)
      {
        if(this.t[element][this.set.e[i]] == this.op1ne)
        {
          li.push(this.set.e[i]);
        }
      }
      var ri = Array();
      for(var i=0; i<this.set.n; i++)
      {
        if(this.t[this.set.e[i]][element] == this.op1ne)
        {
          ri.push(this.set.e[i]);
        }
      }

      var i = li.filter((n)=>ri.includes(n))[0];
      return i;
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


       if(node.operator == "-")
       {
         var inv = this.inv[parseInt(node.argument.value)];
         if(typeof node.argument.value === "undefined")
          throw "Ungültiger Ausdruck";
          else if(!this.set.e.includes(node.argument.value))
           throw node.argument.value+" ∉ "+this.set.getSymbol(true);
         else if(typeof inv === "undefined")
          throw "Inverses Element zu "+node.argument.value+" existiert nicht";
        else
          return inv;
       }
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
