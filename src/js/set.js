
Set = function()
{
  this.e = [];
  this.n = 0;

  this.symbol = "ℤ";
  this.getName = function(html)
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
  }

  this.isEmpty = function() {return this.n==0;};
  this.setElements = function(elements)
  {
    if(!(elements instanceof Array))
    {
      this.n = parseInt(elements);
      elements = Array();
      for(var i=0; i<this.n; i++)
        elements[i] = i;
    }
    else
    {
      elements = elements.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
      });
    }
    this.e = elements;
    this.n = this.e.length;
  };
};
