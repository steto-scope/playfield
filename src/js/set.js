
Set = function()
{
  this.e = [];
  this.n = 0;

  this.symbol = "ℤ";
  this.setSymbol = function(symbol) {
    if(symbol.length > 0)
      this.symbol = symbol;
  };

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

  this.isEmpty = function() {return this.n==0;};
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
    else //if(!(elements instanceof Array))
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
