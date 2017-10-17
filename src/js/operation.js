/**
 * represents an operation
 * @param {Set} set the set used for this operation
 * @param {string} symbol symbol of the operation
 * @param {string} genCode JavaScript generator code for the cayley table
 * @param {string} invSymbol inverse notation symbol
 */
Operation = function(set,symbol="+",genCode="(a+b)%n",invSymbol="-")
{
  /**
   * the set of the operation
   */
  this.set = set;
  /**
   * the symbol of the operation
   */
  this.symbol = symbol;
  /**
   * the symbol for inverses
   */
  this.inverseSymbol = invSymbol;
  /**
   * JS generator code for cayley table
   */
  this.tableGeneratorCode = genCode;
  /**
   * the cayley table. 2D array with size n*n
   */
  this.t = [];
  /**
   * annullator of the operation, if exist. boolean false if not existent
   */
  this.annullator = false;
  /**
   * table of inverses. 1D array of size n
   */
  this.inv = [];
  /**
   * detailed information about every single element of the set
   */
  this.elementInfo = [];

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


  /**
   * generates an element of the cayley table.
   * this function is used to encapulate the eval call in order to be able to map certain DOM objects to userfriendly names, like n = this.set.n
   * @param {number} a left operand
   * @param {number} b right operand
   * @param {number} n number of elements in the set
   */
  this.generateElement = function(a,b,n=this.set.n)
  {
    return eval(this.tableGeneratorCode);
  };

  /**
   * performs the operation on the cayley table
   * @param {number} a left operand
   * @param {number} b right operand
   * @param {boolean} isIndex determines if the given operands a and b are indices or actual elements
   * @return {number} result of the operation
   */
  this.map = function(a,b,isIndex=false)
  {
    return this.t[isIndex?this.set.e[a]:a][isIndex?this.set.e[b]:b];
  }

  /**
   * regernerates the entire cayley table and reanalyses the operation structure
   */
  this.regenerateTable = function()
  {
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

  /**
   * determines the inverse of a given element.
   * used to populate the inverse table
   * @param {number} element element to determine its inverse
   * @return {number} inverse
   * @return {undefined} if no inverse exist
   */
  this.inverseOf = function(element)
  {
    //element has to exist in the first place
    if(!this.set.e.includes(element))
      return undefined;

    //determine all left inverses
    var li = Array();
    for(var i=0; i<this.set.n; i++)
    {
      if(this.t[element][this.set.e[i]] == this.neutralElement)
      {
        li.push(this.set.e[i]);
      }
    }

    //determine all right inverses
    var ri = Array();
    for(var i=0; i<this.set.n; i++)
    {
      if(this.t[this.set.e[i]][element] == this.neutralElement)
      {
        ri.push(this.set.e[i]);
      }
    }

    //the inverse exist if both sides have only 1 inverse which is the same (the inverse is uniquely identified)
    var i = li.filter((n)=>ri.includes(n))[0];
    if(li.length>1|| ri.length>1)
      i = undefined;

    return i;
  };


  /**
   * checks if the operation is associative
   * @param {array} s the elements to check against
   * @return {boolean} true, if associative
   * @return {array} first parameters to fail the test
   */
  this.testAssoc = function(s)
  {
     for(var i=0; i<s.n; i++)
       for(var j=0; j<s.n; j++)
         for(var k=0; k<s.n; k++)
           if(this.t[this.t[s.e[i]][s.e[j]]][s.e[k]] != this.t[s.e[i]][this.t[s.e[j]][s.e[k]]])
             return [s.e[i],s.e[j],s.e[k]];
     return true;
   };

   /**
    * checks if the operation is an inner operation
    * @param {array} s the elements to check against
    * @return {boolean} true, if inner
    * @return {array} first parameters to fail the test
    */
   this.testInner = function(s)
   {
     for(var i=0; i<s.n; i++)
       for(var j=0; j<s.n; j++)
         if(!s.e.includes(this.t[s.e[i]][s.e[j]]))
           return this.t[s.e[i]][s.e[j]];
     return true;
   };

   /**
    * checks if the operation is commutative
    * @param {array} s the elements to check against
    * @return {boolean} true, if commutative
    * @return {array} first parameters to fail the test
    */
   this.testCom = function(s)
   {
   		for(var i=0; i<s.n; i++)
   			for(var j=0; j<s.n; j++)
   					if(this.map(i,j,true) != this.map(j,i,true))
   						return [s.e[i],s.e[j]];
   		return true;
   	};

    /**
     * determines the neutral element of the operation
     * @return {boolean} false, if not existent
     * @return {number} neutral element, if existent
     */
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

   /**
    * analyses the operation to determine its properties
    */
   this.analyzeStructure = function()
   {
     //generate the set to be used for (some of) the tests
     //this is needed to exclude non-units like 0 in multiplicative operations from the analysis
     var s = this.set;
     if(this.annullator !== false)
     {
       s = {n:this.set.n-1, e:[] };
       for(var i=0; i<this.set.n;i++)
        if(this.set.e[i] != this.annullator)
          s.e.push(this.set.e[i]);
     }

     //test if magma
     this.commutativeError = this.testCom(s);
     this.isCommutative = this.commutativeError === true;

     this.innerError = this.testInner(this.set);
     this.isInner = this.innerError === true;

     this.isMagma = this.isInner;

     //test if emigroup
     this.assocError = this.testAssoc(this.set);
     this.isAssoc = this.assocError === true;

     this.isSemigroup = this.isMagma && this.isAssoc;

     //test if monoid
     this.neutralElement = this.determineNeutralElement();
     this.hasNeutralElement = this.neutralElement !== false;

     this.isMonoid = this.isSemigroup && this.hasNeutralElement;

     //test if group
     //it also generates the inverses since we need to know the neutral element before we can do this
     //todo: separate the generation of inverses and determine of the neutral element from the structure analysis to be more flexible
     this.hasInverse = this.hasNeutralElement;
     for(var i=0; i<this.set.n; i++)
     {
       this.inv[this.set.e[i]] = this.inverseOf(this.set.e[i]);
       if(typeof this.inv[this.set.e[i]] === "undefined" && this.set.e[i] != this.annullator)
        this.hasInverse = false;
     }

     this.isGroup = this.isMonoid && this.hasInverse;

     //determine element infos
     for(var i=0; i<this.set.n; i++)
      this.elementInfo[this.set.e[i]] = this.determineElementInfo(this.set.e[i]);
   };


   /**
    * determines detailed information about a given element
    * @param {number} element the element to anayse
    * @return {object} collected information
    */
   this.determineElementInfo = function(element)
   {
     var o = {};
     o.element = element;

     //determine (left/right) neutrality
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

     //determine (left/right) inverse
     o.leftInverse = o.rightInverse = o.inverse = false;
     if(typeof this.inv[element] !== "undefined")
     {
       o.leftInverse = o.rightInverse = o.inverse = [this.inv[element]];
     }
     else
     {
       o.leftInverse = [];
       o.rightInverse = [];

       //todo: check if right and left are correct or flipped
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


  /**
   * represents the operation as string
   * @return {string}
   */
  this.toString = function()
  {
    return this.symbol;
  };

};
