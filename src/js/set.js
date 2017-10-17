/**
 * Represents a set of elements
 */
Set = function()
{
  /**
   * array of elements
   * do not change this directly, use setElements() instead
   */
  this.e = [];
  /**
   * number of elements in the set.
   * do not change this directly, use setElements() instead
   */
  this.n = 0;
  /**
   * symbol of the set. use setSymbol() to change
   */
  this.symbol = "ℤ";

  /**
   * changes the symbol of the set
   * @param {string} symbol new symbol
   */
  this.setSymbol = function(symbol) {
    if(symbol.length > 0)
      this.symbol = symbol;
  };

  /**
   * gets the symbol of the set
   * @param {boolean} html if true, the output uses HTML format
   * @returns {string} symbol
   */
  this.getSymbol = function(html)
  {
    if(this.symbol=="ℤ")
    {
      if(this.n==0)
        return "∅";
      if(this.n<10)
        return this.symbol+String.fromCharCode(0x2080+this.n);

      return html ? this.symbol+"<sub>"+this.n+"</sub>" : this.symbol+"_"+this.n;
    }
    return this.symbol;
  };

  /**
   * string representation of the set
   * @param {string} style style of the output.
   * "elements": returns comma separated elements.
   * other values: the full, mathematical version
   * @return {string} output
   */
  this.toString = function(style)
  {
    switch(style)
    {
      case "elements":
        return this.e.join(", ");
      default:
        return this.getSymbol(true)+" = {"+this.e.join(", ")+"}";
    }
  };

  /**
   * checks if the set is empty
   * @return {boolean}
   */
  this.isEmpty = function() {return this.n==0;};

  /**
   * sets the elements of the set
   * @param {number} elements set all numbers ranging [0,n)
   * @param {array} elements set all unique elements
   * @param {string} elements parse the string (comma, semicolon or whitespace separated) and use unique elements
   */
  this.setElements = function(elements=0)
  {
    if (typeof elements === 'string' || elements instanceof String)
    {
        r = new RegExp("(\\d+?)(\\s+|,|;|$)","ig");
        arr = Array();
        while((match = r.exec(elements)))
        {
          newint = parseInt(match[1]);
          if(!arr.includes(newint))
            arr.push(newint);
        }
        elements = arr;
    }
    else if(elements instanceof Array)
    {
      elements = elements.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
      });
    }
    else 
    {
      this.n = parseInt(elements);
      elements = Array();
      for(var i=0; i<this.n; i++)
        elements[i] = i;
    }

    this.e = elements;
    this.n = this.e.length;
  };
};
