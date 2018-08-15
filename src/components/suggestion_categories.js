import path from 'path'

var music = `18+,21+,A Cappella,
Acoustic,
African,
Afropop,
All Ages,
Alt-Country,
Alternative,
Ambient,
Americana,
Art Rock,
Avant-Garde,
Bachata,
Big Band,
Bluegrass,
Blues,
Bossa Nova,
Brass Band,
Britpop,
Broadway,
Burlesque,
Cabaret,
Celtic,
Chamber Music,
Children,
Choral,
Classic Rock,
Classical,
Country,
Covers,
Cumbia,
Dance,
Dancehall,
Disco,
DJ,
Drag,
Drink Specials,
Drum 'n' Bass,
Dub,
Eclectic,
EDM,
Electro,
Electronic,
Emo,
Experimental,
Family,
Festival,
Film & Audio-Visual,
Flamenco,
Folk,
Free,
Funk,
Fusion,
Garage,
Gothic,
Guitar,
Gypsy,
Happy Hour,
Hard Rock,
Hardcore,
Hawaiian,
Hip-Hop,
House,
Improvisational,
Indie Rock,
Industrial,
Instrumental,
International,
Jam Band,
Jam Sessions,
Jazz,
Karaoke,
Kiddie Pop,
Latin,
Latin Pop,
LGBT,
Lounge,
Mashups,
Merengue,
Metal,
Metalcore,
Nerdcore,
New Age,
New Wave,
Oldies,
Opera,
Other,
Piano,
Pop,
Pop Punk,
Post-Hardcore,
Post-Punk,
Post-Rock,
Power Pop,
Psychedelic,
Punk,
R&B,
Rap,
Reggae,
Reggaeton,
Religious,
Rock,
Rockabilly,
Salsa,
Service Industry,
Shoegaze,
Showtunes,
Singer-Songwriter,
Ska,
Smooth Jazz,
Soul,
Spoken Word & Poetry,
Swing,
Tango,
Top 40,
Trance,
Tribute,
Tropical,
Variety,
Vocal,
World`

music = music.split(",")
suggestions = []
for(var i=0; i< music.length; i++){
  music[i] = music[i].replace('\n','')
  suggestions.push({ id: String(music[i]), text: String(music[i])})
}

var performance = `Burlesque
Cabaret & Drag
Circus
Magic
Performance Art
Theater`

performance = performance.split(`\n`)
for(var i=0; i< performance.length; i++){
  suggestions.push({ id: String(performance[i]), text: String(performance[i])})
}

var arts =`Art - Classes
Art - Galleries
Art - Museums
Arts
Craft Events
Film Events & Repertory
Television`

arts = arts.split(`\n`)
for(var i=0; i< arts.length; i++){
  suggestions.push({ id: String(performance[i]), text: String(performance[i])})
}

var more_suggest = [{ id: 'LGBT', text: 'LGBT' },
          { id: 'Comedy', text: 'Comedy' },
          { id: 'Open Mic', text: 'Open Mic' },
          { id: 'Poetry', text: 'Poetry' },
          { id: 'Spoken Word', text: 'Spoken Word' },
          { id: 'Literary', text: 'Literary' },
          { id: 'Sex and Fetish', text: 'Sex and Fetish' },
          { id: 'Body Positivity', text: 'Body Positivity' },
          { id: 'Kid Friendly', text: 'Kid Friendly' },
          { id: 'Pet Friendly', text: 'Pet Friendly' }]

var suggestions = suggestions.concat(more_suggest)
for(var i=0; i < more_suggest.length; i++){
  suggestions.push
}
var suggestionsList = suggestions

export default suggestionsList
