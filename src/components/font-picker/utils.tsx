/*
Adds a font family to the document head. 

from https://stackoverflow.com/questions/33404458/using-javascript-to-create-a-link-element-and-then-adding-it-to-head-section

Use with: 
fontLoader({
        family: 'Oswald',
        // effect: 'neon'
    });
*/
export function fontLoader(family: string){
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';

    document.head.appendChild(link);

    link.href = 'http://fonts.googleapis.com/css?family=' + family // + '&effect=' + param.effect;

};

/*
useEffect(() => {
    async function fetchFonts() {
      try {
        setLoading(true);
        // Call your Netlify function
        const response = await fetch('/.netlify/functions/getGoogleFonts?sort=popularity');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setFonts(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFonts();
  }, []);

*/

/*
    Generates list of font family names
*/
const fetchFonts = async () => {

    try {
        //const apiKey = 'AIzaSyDpF61PWgesaiyrQIbZxBTXp2WKSUYzoAU';
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;

        console.log("API KEY: ", apiKey);

        const response = await fetch(
            `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`
        );
        
        if (!response.ok) {
            console.log(response);
            throw new Error('Failed to fetch fonts');
        }
        
        const data = await response.json();
        const fontFams = data.items.map((item: any) => item.family);
        return fontFams
    } catch (err: any) {
        console.log(err.message);
    }
};

/*
    Overall method encompassing all of this 
*/
export async function addAllFonts(){
    // get font list
    const fonts = await fetchFonts();
    // add link for each font family to document head
    fonts.map((font: string) => (
        fontLoader(font)
    ));
    // returns list of font names to be used for previewing
    return fonts;
}