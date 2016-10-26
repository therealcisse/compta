const { normalize, } = require('./normalizer');

const flatmap = require('lodash.flatmap');
const compact = require('lodash.compact');
const contains = require('lodash.contains');
const map = require('lodash.map');
const filter = require('lodash.filter');

const memoize = require('lodash.memoize');

const stopWords = [
  "à","absolument","afin","ailleurs","ainsi","ait","alors","anterieur","anterieure","anterieures","apres","as","assez","au","aucun","aucune","aupres","auquel","auraient","aurait","aussi","autre","autrefois","autrement","autres","autrui","aux","avaient","avait","avant","avec","avoir","avons","bas","basee","bat","beau","beaucoup","bien","car","ce","celle","celle-ci","celles","celui","certain","certaine","certaines","certains","ces","cet","cette","ceux","chacun","chacune","chez","comme","comparable","comparables","contre","dans","de","dedans","dehors","deja","depuis","dernier","derniere","derriere","des","des","desormais","desquels","different","differentes","differents","directe","directement","dit","dite","dits","divers","diverses","doit","doivent","donc","dont","du","duquel","egale","egalement","egales","elle","elles","en","encore","enfin","entre","envers","est","et","eux","extenso","exactement","exterieur","je","juste","l","la","laisser","le","les","leur","lors","lui","lui-meme","ma","maintenant","mais","malgre","maximale","me","meme","memes","mien","miennes","minimale","moi","moindres","moi-meme","moins","mon","multiple","multiples","naturel","naturelle","naturelles","ne","ne","neanmoins","necessaire","necessairement","ni","non","notamment","notre","nous","nouveau","on","ont","ou","ou","outre","ouvert","ouverte","ouverts","par","parce","parfois","parle","parlent","parler","parmi","parseme","pas","pense","permet","peut","peuvent","pire","plein","plus","plusieurs","possessif","possessifs","possible","possibles","pour","pourquoi","pourrais","pourrait","pouvait","prealable","precisement","pres","probable","probante","procedant","proche","pu","puis","puisque","pur","pure","quand","quant","que","quelque","quelques","qui","rare","rarement","rares","relative","relativement","remarquable","rend","rendre","restant","reste","restent","restrictif","retour","rien","sa","sans","sait","se","sein","semblable","semblaient","semble","semblent","sent","sera","seraient","serait","ses","seul","seule","seulement","si","soi","soit","son","sont","sous","souvent","specifique","specifiques","speculatif","strictement","subtiles","suffisant","suffisante","suffit","suis","suit","suivante","suivantes","suivants","suivre","superpose","sur","surtout","tardive","tel","tels","tend","tenir","tente","toujours","tous","tout","toute","toutefois","toutes","tres","un","une","uniformement","unique","uniques","vous"];

const isStopWord = memoize(function hasStopWords(w){
  return contains(stopWords, w);
});

function split(s){
  return Array.isArray(s)
    ? flatmap(s, split)
    : (s || '').split(/\b/);
}

module.exports = function makeWords(...args){
  let words = flatmap(args, split);

  words = compact(words)

  words = filter(words, function(w) {
    return w.match(/^\w+$/) && ! isStopWord(w);
  });

  words = map(words, word => normalize(word));

  return words;
};
