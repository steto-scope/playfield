
/**
 * generates the HTML of a cayley table
 * @param {Operation} op the operation that shall be displayed
 * @param {boolean} hideZero true if zeros should be not displayed, default: false
 * @return {string} HTML
 */
function renderTable(op,hideZero=false)
{
	var o = '<table class="cayley '+op.symbol+'"><thead><tr><th>'+op.symbol+'</th>';
	for(var i =0; i<op.set.n; i++)
		if(!(hideZero && i==0))
			o+='<th class="draggable" title="Ziehe die Tabellenüberschrift in die Zellen um die Verknüpfungstabelle manuell zu verändern">'+op.set.e[i]+'</th>';
	o+='</tr></thead><tbody>';

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
			}
			o+='</tr>';
		}
	}

	o+='</tbody></table>';
	return o;
}

/**
 * generates the HTML for the table displaying inverses and the neutral element
 * @param {Operation} op the operation of the inverses
 * @param {boolean} hideZero true if zeros should be not displayed, default: false
 * @return {string} HTML
 */
function renderInvTable(op,hideZero=false) {

	if(!op.hasNeutralElement)
		return "";

	var o = '<table class="cayley inv"><thead><tr><th>a</th>';
	for(var i =0; i<op.set.n; i++)
		if(!(hideZero && i==0))
			o+='<th>'+op.set.e[i]+'</th>';
	o+='<td style="border:none;"></td><th title="Neutrales Element">e</th></tr></thead><tbody><tr><th>'+op.inverseSymbol+'a</th>';

	for(var i =0; i<op.set.n; i++)
	{
      x = op.inv[op.set.e[i]];
			if(!(hideZero && j==0))
				o+='<td class="'+(op.set.e.indexOf(x)<0?"noElement":"")+'">'+(typeof x !== "undefined" ? x : "")+'</td>';
	}

	o+='<td style="border:none;"></td><td>'+op.neutralElement+'</td></tr></tbody></table>';
	return o;
}

/**
 * generates the HTML of an element mouseover tooltip
 * @param {Operation} op the operation
 * @param {number} element the element
 * @return {string} HTML
 */
function renderElementTooltip(op,element)
{
	var info = op.elementInfo[element];

	if(typeof info === "undefined")
		return "";

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

/**
 * generates the HTML for an operation's structure type info
 * @param {Operation} op operation
 * @return {string} HTML
 */
function renderOperationClass(op)
{
	var o = '<table style="border-collapse:collapse" width="100%">';
 	o+='<tr class="minorClass"><td rowspan="2" style="font-size:1.2em; text-align:center; vertical-align:middle;">('+op.set.getSymbol()+(op.annullator!==false?"\\{"+op.annullator+"}":"")+','+(op.symbol)+'):</td><td class="'+(op.isInner ? "classTrue":"classFalse")+'">innere Verkn.</td><td class="'+(op.isAssoc ? "classTrue":"classFalse")+'">assoziativ</td><td class="'+(op.hasNeutralElement ? "classTrue":"classFalse")+'">neutr. Element</td><td class="'+(op.hasInverse ? "classTrue":"classFalse")+'">Inverse</td></tr>'
	o+='<tr class="majorClass"><td class="'+(op.isMagma ? "classTrue":"classFalse")+'">Magma</td><td class="'+(op.isSemigroup ? "classTrue":"classFalse")+'">Halbgruppe</td><td class="'+(op.isMonoid ? "classTrue":"classFalse")+'">Monoid</td><td class="'+(op.isGroup ? "classTrue":"classFalse")+'">Gruppe</td></tr>'
	o+='</table>';
	return o;
}

/**
 * generates the HTML for an structure type info
 * @param {Field} s structure
 * @return {string} HTML
 */
function renderStructClass(s)
{
	var o = '<table style="border-collapse:collapse" width="100%">';
 	o+='<tr class="minorClass"><!--<td class="ElCaption" rowspan="2" style="text-align:center; vertical-align:middle;">'+s+':</td>--><td colspan="5" class="'+(s.isDistributive ? "classTrue":"classFalse")+'">distributiv</td></tr>'
	o+='<tr class="majorClass"><td class="'+(s.isRing ? "classTrue":"classFalse")+'">Ring</td><td class="'+(s.isRingWith1 ? "classTrue":"classFalse")+'">Ring mit 1</td><!--<td class="'+(s.isDivisionring ? "classTrue":"classFalse")+'">Divisionsring</td>--><td class="'+(s.isField ? "classTrue":"classFalse")+'">Körper</td></tr>'
	o+='</table>';
	return o;
}


/**
 * generates the HTML for the detailed expression evaluation
 * @param {object} output evaluation output returned by Structure.calculateExpression()
 * @return {string} HTML
 */
function renderExpressionEvaluation(output)
{
	var o = '<pre class="exprResult">';
	o+=output.str+" = "+output.result+"<br><br>";

	tmpResult = Array(output.log.length);

	//calculates and adds each intermediate step of the expression evaluation
	for(var i=0; i<output.log.length; i++)
	{
		var line ="";
		var r, l;

		if(output.log[i][4] == "BinaryExpression")
		{
			l = typeof tmpResult[output.log[i][1]] !== "undefined" ? tmpResult[output.log[i][1]] : output.log[i][6];
			r = typeof tmpResult[output.log[i][2]] !== "undefined" ? tmpResult[output.log[i][2]] : output.log[i][7];

			//spaces until left operand
			for(var j=0; j<output.log[i][5]-l.toString().length; j++)
				line+=' ';

			//left operand
			line+= l;

			//spaces until operator
			for(var j=line.length; j<output.log[i][5]; j++)
				line+=' ';

			//operator
			line+=output.log[i][3];

			//right operand
			line+=r;
		}
		else
		{
			r = typeof tmpResult[output.log[i][1]] !== "undefined" ? tmpResult[output.log[i][1]] : output.log[i][6];

			//spaces until operand
			for(var j=0; j<output.log[i][1]-1; j++)
				line+=' ';

			//operator
			line+=output.log[i][3];
			//operand
			line+=r;
		}

		//spaces until end of the expression
		for(var j=line.length; j<output.length; j++)
			line+=' ';

		//intermediate result
		line+=" = ";
		line+=output.log[i][0];

		//append to the ouput
		o+=line;
		o+="<br>";
	}
	o+='</pre>';
	return o;
}
