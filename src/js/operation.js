Operation = function(set=[],symbol="+",genCode="(a+b)%n",invSymbol="-",invPrefix=true)
{

  this.set = set;
  this.symbol = symbol;
  this.inverseSymbol = invSymbol;
  this.inverseSymbolIsPrefix = invPrefix;
  this.tableGeneratorCode = genCode;
  this.t = [];
  this.annullator = false;

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
        if(li.length>1|| ri.length>1)
          i = undefined;
        return i;
      };



/* structure analytics */

  this.isInner = false;
  this.innerError = false;
  this.isAssoc = false;
  this.assocError = false;
  this.isCommutative = false;
  this.commutativeError = false;
  this.neutralElement = false;
  this.hasNeutralElement = false;
  this.isMagma = false;
  this.isSemigroup = false;
  this.isMonoid = false;
  this.isGroup = false;


  this.testAssoc = function(s) {
   for(var i=0; i<s.n; i++)
     for(var j=0; j<s.n; j++)
       for(var k=0; k<s.n; k++)
         if(this.t[this.t[s.e[i]][s.e[j]]][s.e[k]] != this.t[s.e[i]][this.t[s.e[j]][s.e[k]]])
           return [s.e[i],s.e[j],s.e[k]];
   return true;
   };

   this.testInner = function(s) {
     for(var i=0; i<s.n; i++)
       for(var j=0; j<s.n; j++)
         if(!s.e.includes(this.t[s.e[i]][s.e[j]]))
           return this.t[s.e[i]][s.e[j]];
     return true;
   };

   this.testCom = function(s) {
 		for(var i=0; i<s.n; i++)
 			for(var j=0; j<s.n; j++)
 					if(this.map(i,j,true) != this.map(j,i,true))
 						return [s.e[i],s.e[j]];
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

     var s = this.set;
     if(this.annullator !== false)
     {
       s = {n:this.set.n-1, e:[] };
       for(var i=0; i<this.set.n;i++)
        if(this.set.e[i] != this.annullator)
          s.e.push(this.set.e[i]);
     }

     this.commutativeError = this.testCom(s);
     this.isCommutative = this.commutativeError === true;

     this.innerError = this.testInner(this.set);
     this.isInner = this.innerError === true;

     this.isMagma = this.isInner;

     this.assocError = this.testAssoc(this.set);
     this.isAssoc = this.assocError === true;

     this.isSemigroup = this.isMagma && this.isAssoc;

     //neutral element
     this.neutralElement = this.determineNeutralElement();
     this.hasNeutralElement = this.neutralElement !== false;

     this.isMonoid = this.isSemigroup && this.hasNeutralElement;

     //inverse elements
     this.hasInverse = this.hasNeutralElement;
     for(var i=0; i<this.set.n; i++)
     {
       this.inv[this.set.e[i]] = this.inverseOf(this.set.e[i]);
       if(typeof this.inv[this.set.e[i]] === "undefined" && this.set.e[i] != this.annullator)
        this.hasInverse = false;
     }


     this.isGroup = this.isMonoid && this.hasInverse;

     for(var i=0; i<this.set.n; i++)
      this.elementInfo[this.set.e[i]] = this.determineElementInfo(this.set.e[i]);
   };


   this.elementInfo = {};
   this.determineElementInfo = function(element)  {
     var o = {};
     o.element = element;

     if(this.neutralElement === element)
     {
       o.isLeftNeutral = o.isRightNeutral = o.isNeutral = true;
     }
     else
     {
       o.isNeutral = false;
       o.isLeftNeutral = true;
       for(var i=0; i<this.set.n; i++)
       {
         if(this.map(element,this.set.e[i]) != this.set.e[i])
          {
            o.isLeftNeutral = false;
            break;
          }
       }
       o.isRightNeutral = true;
       for(var i=0; i<this.set.n; i++)
       {
         if(this.map(this.set.e[i],element) != this.set.e[i])
          {
            o.isRightNeutral = false;
            break;
          }
       }
     }

     o.leftInverse = o.rightInverse = o.inverse = false;
     if(typeof this.inv[element] !== "undefined")
     {
       o.leftInverse = o.rightInverse = o.inverse = [this.inv[element]];
     }
     else
     {
       o.leftInverse = [];
       o.rightInverse = [];

       //todo: check if right and left are correct
       for(var i=0; i<this.set.n; i++)
       {
         if(this.t[element][this.set.e[i]] == this.neutralElement)
         {
           o.leftInverse.push(this.set.e[i]);
         }
       }

       for(var i=0; i<this.set.n; i++)
       {
         if(this.t[this.set.e[i]][element] == this.neutralElement)
         {
           o.rightInverse.push(this.set.e[i]);
         }
       }
     }

     return o;
   };



  this.toString = function(group){
    return this.symbol/*+(group && this.annullator !== false ? "\\{"+this.annullator+"}" : "")*/;
  };

};
