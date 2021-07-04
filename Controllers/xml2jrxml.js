let fs = require("fs");
let jrxml = "";
let Frdf;
let index = -1;

exports.convert = async (analogie, rdf, id, Nb) => {
  Frdf = rdf;
  let result = recJSON(analogie);
  result += "</jasperReport>";
  fs.writeFileSync(`Files/Jrxml/jrxml-${id}-(${Nb + 1}).jrxml`, result, "utf8");
};

function recJSON(analogTmp) {
  let jr = "";
  for (key in analogTmp) {
    if (analogTmp[key].isTable) {
      let l = getSourceLength(analogTmp[key].source);
      for (let i = 0; i < l; i++) {
        jr += "<" + key + " ";

        if (analogTmp[key].hasOwnProperty("attr")) {
          for (attribute in analogTmp[key].attr) {
            jr += " " + attribute;
            jr +=
              "=" +
              getSourceFromXMLtable(
                analogTmp[key].source,
                analogTmp[key]["attr"][attribute],
                i
              ) +
              " ";
          }
        }
        if (analogTmp[key].def != 0) {
          let def = analogTmp[key].def;
          jr += "> \n ";
          jr += def.replace(
            "#source#",
            getSourceFromAttr(
              analogTmp[key].source,
              analogTmp[key].sourceDef,
              index
            )
          );
          jr += "/> \n ";
        }

        if (analogTmp[key].hasChild) {
          //nb=analogTmp[key].child.length;
          jr += "/> \n ";
          // for (var   ch =0; ch < nb; ch++) {
          //   analogTmp = analogTmp[key].child[ch];
          //   index = i;

          // return recJSON(analogTmp);}
        } else {
          jr += "/> \n ";
          if (i == l - 1) {
            return jr;
          }
        }
      }
    } else {
      jr += "<" + key + " ";
      if (analogTmp[key].hasOwnProperty("attr")) {
        for (attribute in analogTmp[key].attr) {
          jr += " " + attribute;
          jr += "=" + getSourceFromXML(analogTmp[key]["attr"][attribute]) + " ";
        }
      }
      if (analogTmp[key].def != 0) {
        let def = analogTmp[key].def;
        jr += "> \n ";
        jr += def = getSourceFromXML(analogTmp[key].sourceDef);
        //jr +=">";
      }
      if (analogTmp[key].hasChild) {
        //  console.log(analogTmp[key].child.length+"++++++++++++++++++")
        nb = analogTmp[key].child.length;
        // console.log(jr);
        jr += "> \n ";

        // console.log("key",key)
        var Child = analogTmp[key].child;
        Child.forEach((node, i) => {
          //console.log(i ,':',node)

          analogTmp = node;
          jr += recJSON(node);

          // console.log(node);
        });
        // console.log(jr);

        // console.log(key + "+" + "teeeeeeeeeeeeeeeeest ");
      } else {
        jr += "> \n " + "</" + key + "> \n ";
        return jr;
      }
    }
  }

  return jrxml + jr;
}

// recuperer source simple
function getSourceFromXML(source) {
  try {
    let tab = source.split(".");
    let rdftmp = Frdf;
    for (var i = 0; i < tab.length; i++) {
      rdftmp = rdftmp[tab[i]];
    }

    return JSON.stringify(rdftmp);
  } catch (e) {
    return "";
  }
}
// recupere source sous forme tableau
function getSourceFromXMLtable(source, node, n) {
  let rdftmp = Frdf;
  try {
    let tab = source.split(".");
    for (let i = 0; i < tab.length; i++) {
      rdftmp = rdftmp[tab[i]];
    }
    rdftmp = rdftmp[n];
    tab = node.split(".");
    for (let i = 0; i < tab.length; i++) {
      rdftmp = rdftmp[tab[i]];
    }

    return node.length > 0 ? JSON.stringify(rdftmp) : JSON.stringify(rdftmp[n]);
  } catch (e) {
    return "";
  }
}

// recupere length de source
function getSourceLength(source) {
  try {
    let tab = source.split(".");
    let rdftmp = Frdf;
    for (let i = 0; i < tab.length; i++) {
      rdftmp = rdftmp[tab[i]];
    }

    return rdftmp.length;
  } catch (e) {
    return 0;
  }
}

function getSourceFromAttr(source, sourceAttr, index) {
  var rdftmp = Frdf;
  try {
    let tab = source.split(".");
    for (let i = 0; i < tab.length; i++) {
      rdftmp = rdftmp[tab[i]];
      // console.log({ rdftmp });
    }
    rdftmp = rdftmp[index];
    index = -1;
    tab = sourceAttr.split(".");
    for (let i = 0; i < tab.length; i++) {
      rdftmp = rdftmp[tab[i]];
    }

    return sourceAttr.length > 0 ? JSON.stringify(rdftmp) : "";
  } catch (e) {
    return "";
  }
}

// function JsonChild(analogTmp){

// var jr=recJSON(analogTmp)

//   if (analogTmp[key].hasChild) {

//     //  console.log(analogTmp[key].child.length+"++++++++++++++++++")
//      nb=analogTmp[key].child.length
//      console.log(jr)
//     jr += ">";

//     // console.log("key",key)
//     var Child = analogTmp[key]?.child
//     Child.forEach((node,i) => {
//      // console.log(i ,':',node)

//       analogTmp= node
//      jr +=recJSON(node)

//     });

//      var Parent=Child
//      var Child1=Parent[key]?.child

//        Parent.forEach((node,i) => {
//         // console.log(Object.keys(node));
//          var nom=Object.keys(node)
//         var item = node[nom[0]]

//       if(item.hasChild){

//          var Child = item.child
//          Child.forEach((node,i) => {
//       //  console.log(i ,':',node)

//        jr +=recJSON(node)
//       //  console.log("####################")
//       //   console.log("####################")
//       });}

//       });

//   //  console.log(jr)

//     console.log(key+"+"+"teeeeeeeeeeeeeeeeest ")

//  }
//   else{
//     jr += ">" + "</"+ key+ ">";
//     return jr;
//   }

//  }  }

// }
