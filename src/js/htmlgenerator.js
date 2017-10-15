
function renderTable(op,hideZero=false,hideInverse=false)
{
	var o = '<table class="cayley '+op.symbol+'"><thead><tr><th>'+op.symbol+'</th>';
	for(var i =0; i<op.set.n; i++)
		if(!(hideZero && i==0))
			o+='<th class="draggable" title="Ziehe die Tabellenüberschrift in die Zellen um die Verknüpfungstabelle manuell zu verändern">'+op.set.e[i]+'</th>';
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
			o+='<tr><th class="draggable" title="Ziehe die Tabellenüberschrift in die Zellen um die Verknüpfungstabelle manuell zu verändern">'+op.set.e[i]+'</th>';
			for(var j=0; j<op.set.n; j++)
			{
        x = op.map(i,j,true);
				if(!(hideZero && j==0))
					o+='<td class="dropable '+op.symbol+' row_'+i+' col_'+j+' '+(op.set.e.indexOf(x)<0?"noElement":"")+'">'+x+renderElementTooltip(op,x)+'</td>';
					/*if(i==0 && j==op.set.n-1)
					o+='<td style="border:none;" rowspan="100"><span class="tooltip"><table><tr><th>Element:</th><td><span class="toolt"</td></tr></td>';*/
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
	o+='</tr></thead><tbody><tr><th>'+op.inverseSymbol+'a</th>';

	for(var i =0; i<op.set.n; i++)
	{
        x = op.inv[op.set.e[i]];
				if(!(hideZero && j==0))
					o+='<td class="'+(op.set.e.indexOf(x)<0?"noElement":"")+'">'+(typeof x !== "undefined" ? x : "")+'</td>';


	}

	o+='</tr></tbody></table>';
	return o;
}

function renderElementTooltip(op,element)
{
	var info = op.elementInfo[element];
	o = '<span class="tooltip"><table>';

	o+='<tr><th><em>Element:</em></th><td><em>'+element+'</em></td></tr>';
	o+="<tr><th></th><td></td></tr>";
	o+='<tr><th>Linksneutral:</th><td>'+(info.isLeftNeutral?'<span class="ok">ja</span>':'<span class="notok">nein</span>')+'</td></tr>';
	o+='<tr><th>Rechtsneutral:</th><td>'+(info.isRightNeutral?'<span class="ok">ja</span>':'<span class="notok">nein</span>')+'</td></tr>';
	o+='<tr><th><em>Neutral:</em></th><td><em>'+(info.isNeutral?'<span class="ok">ja</span>':'<span class="notok">nein</span>')+'</em></td></tr>';
	if(op.hasNeutralElement)
	{
		o+='<tr><th>Linksinverse:</th><td>'+(info.leftInverse !== false?'<span class="ok">'+info.leftInverse.join(", ")+'</span>':'<span class="notok">keine</span>')+'</td></tr>';
		o+='<tr><th>Rechtsinverse:</th><td>'+(info.rightInverse !== false?'<span class="ok">'+info.rightInverse.join(", ")+'</span>':'<span class="notok">keine</span>')+'</td></tr>';
		o+='<tr><th><em>Inverses Element:</em></th><td><em>'+(info.inverse !== false?'<span class="ok">'+info.inverse.join(", ")+'</span>':'<span class="notok">keines</span>')+'</em></td></tr>';
	}
	o+='</table></span>';
	return o;
}

function renderOperationClass(op) {
	var o = '<table style="border-collapse:collapse" width="100%">';
 	o+='<tr class="minorClass"><td rowspan="2" style="font-size:1.2em; text-align:center; vertical-align:middle;">('+op.set.getSymbol()+(op.annullator!==false?"\\{"+op.annullator+"}":"")+','+(op.symbol)+'):</td><td class="'+(op.isInner ? "classTrue":"classFalse")+'">innere Verkn.</td><td class="'+(op.isAssoc ? "classTrue":"classFalse")+'">assoziativ</td><td class="'+(op.hasNeutralElement ? "classTrue":"classFalse")+'">neutr. Element</td><td class="'+(op.hasInverse ? "classTrue":"classFalse")+'">Inverse</td></tr>'
	o+='<tr class="majorClass"><td class="'+(op.isMagma ? "classTrue":"classFalse")+'">Magma</td><td class="'+(op.isSemigroup ? "classTrue":"classFalse")+'">Halbgruppe</td><td class="'+(op.isMonoid ? "classTrue":"classFalse")+'">Monoid</td><td class="'+(op.isGroup ? "classTrue":"classFalse")+'">Gruppe</td></tr>'
	o+='</table>';
	return o;
}
