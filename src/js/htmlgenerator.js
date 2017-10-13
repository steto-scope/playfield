
function renderTable(op,hideZero=false,hideInverse=false)
{
	var o = '<table class="cayley '+op.symbol+'"><thead><tr><th>'+op.symbol+'</th>';
	for(var i =0; i<op.set.n; i++)
		if(!(hideZero && i==0))
			o+='<th class="draggable">'+op.set.e[i]+'</th>';
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
	for(var i =0; i<op.set.n; i++)
	{
		if(!(hideZero && i==0))
		{
			o+='<tr><th class="draggable">'+op.set.e[i]+'</th>';
			for(var j=0; j<op.set.n; j++)
			{
        x = op.map(i,j,true);
				if(!(hideZero && j==0))
					o+='<td class="dropable '+op.symbol+' row_'+i+' col_'+j+' '+(op.set.e.indexOf(x)<0?"noElement":"")+'">'+x+'</td>';
			}
			o+='</tr>';
		}
	}

	o+='</tbody></table>';
	return o;
}

function renderInvTable(op,hideZero=false) {

	if(!op.hasNeutralElement)
		return "";

	var o = '<table class="cayley add inv"><thead><tr><th>a</th>';
	for(var i =0; i<op.set.n; i++)
		if(!(hideZero && i==0))
			o+='<th>'+op.set.e[i]+'</th>';
	o+='</tr></thead><tbody><tr><th>-a</th>';

	for(var i =0; i<op.set.n; i++)
	{
        x = op.inv[op.set.e[i]];
				if(!(hideZero && j==0))
					o+='<td class="'+(op.set.e.indexOf(x)<0?"noElement":"")+'">'+(typeof x !== "undefined" ? x : "")+'</td>';


	}

	o+='</tr></tbody></table>';
	return o;
}
