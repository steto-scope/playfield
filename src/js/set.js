
Set = function()
{
  this.e = [];
  this.n = 0;

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
