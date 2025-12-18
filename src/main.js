import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://flwtxxzmabehcaktnkme.supabase.co';
const supabaseKey = import.meta.env.VITE_SECRET_KEY;

let wordSection;
let submitSection;
let submitButton = document.querySelector("#kanji-submit");

window.addEventListener("DOMContentLoaded", () => {
  wordSection = document.querySelector("#word-section");
  submitSection = document.querySelector("#submit-section");
})

class Home{
  constructor(){
     this.initSupabase();
     this.getData();
     this.initWord();
  }

initSupabase(){
  this.supabase = createClient(supabaseUrl, supabaseKey);
}

async getData(){
  const { data,error }= await this.supabase.from('kanji').select();
  return data ;
}

async initWord()
{
  let words = await this.getData(Promise.resolve);
  words.forEach((element) => {
  let japWord;
  if(element.katakana == null){
    japWord = element.hiragana;
  }
  else{
    japWord = element.katakana;
  }
    wordSection.innerHTML += this.initSingleCard(element.kanji, japWord, element.traduction);
  })
    
let flashcards = document.querySelectorAll(".flip-card");

flashcards.forEach((card) =>
{

  let isCardActive = false;

  card.addEventListener("click",() => {
    if(!isCardActive){
    card.classList.add("active");
    isCardActive = true;
    }
    else{
     card.classList.remove("active");
    isCardActive = false;
    }
    
  })}
) 
  }

  initSingleCard(word,character,trad){
  let singleCard =
   `
  <div class="flip-card">
  <div class="flip-card-inner">
  <div class="flip-card-front">
  <h1>${word}</h1>
  </div>
  <div class="flip-card-back">
   <h1>${word}</h1>
   <p>${character}</p>
   <p>${trad}</p>
  </div>
  </div>
  </div>
  `
  return singleCard;
  }
}

submitButton.addEventListener("click", () => {
  let kanjiValue = document.getElementById('kanji-value').value ;
  let hiraganaValue = document.getElementById('hiragana-value').value;
  let katakanaValue = document.getElementById('katakana-value').value;
  let romanjiValue = document.getElementById('romanji-value').value;
  let traductionValue = document.getElementById('traduction-value').value;

  console.log(kanjiValue,hiraganaValue,katakanaValue,romanjiValue,traductionValue)
})
new Home();

