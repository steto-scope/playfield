Operation = function(set=[])
{

  this.set = set;
  this.symbol = "⊕";
  this.inverseSymbol = "-";
  this.inverseSymbolIsPrefix = true;
  this.tableGeneratorCode = "(a+b)%n";
  this.t = [];

  this.generateElement = function(a,b,n=this.set.n)
  {
    return eval(this.tableGeneratorCode);
  };

  this.map = function(a,b,isIndex=false) {
    return this.t[isIndex?this.set.e[a]:a][isIndex?this.set.e[b]:b];
  }

  this.regenerateTable = function() {
    //operation table
    this.t = Array(this.set.n);
    for(var i=0; i<this.set.n; i++)
     {
       this.t[this.set.e[i]] = Array(this.set.n);
       for(var j=0; j<this.set.n; j++)
         this.t[this.set.e[i]][this.set.e[j]] = this.generateElement(this.set.e[i],this.set.e[j]);
     }

     this.analyzeStructure();
  };






      /* inverse elements */

      this.inv = [];
      this.inverseOf = function(element) {
        if(!this.set.e.includes(element))
          return undefined;

        var li = Array();
        for(var i=0; i<this.set.n; i++)
        {
          if(this.t[element][this.set.e[i]] == this.neutralElement)
          {
            li.push(this.set.e[i]);
          }
        }
        var ri = Array();
        for(var i=0; i<this.set.n; i++)
        {
          if(this.t[this.set.e[i]][element] == this.neutralElement)
          {
            ri.push(this.set.e[i]);
          }
        }

        var i = li.filter((n)=>ri.includes(n))[0];
        return i;
      };



/* structure analytics */

  this.isInner = false;
  this.innerError = false;
  this.isAssoc = false;
  this.assocError = false;
  this.neutralElement = false;
  this.hasNeutralElement = false;
  this.isMagma = false;
  this.isSemigroup = false;
  this.isMonoid = false;
  this.isGroup = false;


  this.testAssoc = function() {
   for(var i=0; i<this.set.n; i++)
     for(var j=0; j<this.set.n; j++)
       for(var k=0; k<this.set.n; k++)
         if(this.t[this.t[this.set.e[i]][this.set.e[j]]][this.set.e[k]] != this.t[this.set.e[i]][this.t[this.set.e[j]][this.set.e[k]]])
           return [this.set.e[i],this.set.e[j],this.set.e[k]];
   return true;
   };

   this.testInner = function() {
     for(var i=0; i<this.set.n; i++)
       for(var j=0; j<this.set.n; j++)
         if(!this.set.e.includes(this.t[this.set.e[i]][this.set.e[j]]))
           return this.t[this.set.e[i]][this.set.e[j]];
     return true;
   };

      this.determineNeutralElement = function()
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
        };



   this.analyzeStructure = function() {

     this.innerError = this.testInner();
     this.isInner = this.innerError === true;

     this.isMagma = this.isInner;

     this.assocError = this.testAssoc();
     this.isAssoc = this.assocError === true;

     this.isSemigroup = this.isMagma && this.isAssoc;

     //neutral element
     this.neutralElement = this.determineNeutralElement();
     this.hasNeutralElement = this.neutralElement !== false;

     this.isMonoid = this.isSemigroup && this.hasNeutralElement;

     //inverse elements
     for(var i=0; i<this.set.n; i++)
     {
       this.inv[this.set.e[i]] = this.inverseOf(this.set.e[i]);
     }

     this.isGroup = this.isMonoid && this.inv.includes(undefined);
   };





  this.toString = function(){
    return this.symbol;
  };

};
