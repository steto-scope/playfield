
function renderTable(s,hideZero=false,hideInverse=false)
{
	var o = '<table class="cayley add"><thead><tr><th>'+s.opSymbol+'</th>';
	for(var i =0; i<s.set.n; i++)
		if(!(hideZero && i==0))
			o+='<th>'+s.set.e[i]+'</th>';
	o+='</tr></thead><tbody>';

/*
	if(!hideInverse)
	{
		//todo: use of inverseAddTable()
		o+='<tr><th class="inv">Inv</th>';
		for(var i =0; i<table[0].length; i++)
			if(!(hideZero && i==0))
				o+='<td class="inv '+(Polynom_toString([NumberSystem.inverseTo(NumberSystem.zero,i,operation)]) == Polynom_toString(NumberSystem.toPolynom(i)) ? "selfinverse":  "")+'">'+Polynom_toString([NumberSystem.inverseTo(NumberSystem.zero,i,operation)])+'</td>';
		o+='</tr>';
	}
*/
	for(var i =0; i<s.set.n; i++)
	{
		if(!(hideZero && i==0))
		{
			o+='<tr><th>'+s.set.e[i]+'</th>';
			for(var j=0; j<s.set.n; j++)
			{
        x = s.t[s.set.e[i]][s.set.e[j]];
				if(!(hideZero && j==0))
					o+='<td class="'+(s.set.e.indexOf(x)<0?"noElement":"")+'">'+x+'</td>';
			}
			o+='</tr>';
		}
	}

	o+='</tbody></table>';
	return o;
}
