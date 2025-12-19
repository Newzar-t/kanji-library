import "./style.css";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://flwtxxzmabehcaktnkme.supabase.co";
const supabaseKey = import.meta.env.VITE_SECRET_KEY;

let wordSection;
let submitSection;
let buttonSection;
let updateForm;
let buttonUpdateForm;
let blurDiv = document.querySelector("#blur-div");

  wordSection = document.querySelector("#word-section");
  submitSection = document.querySelector("#submit-section");
  buttonSection = document.querySelector("#submit-section-hidder");
  updateForm = document.querySelector("#update-form");
  buttonUpdateForm = document.querySelector("#update-form button");


buttonSection.addEventListener("click",() => {
 submitSection.classList.toggle("hiding")
 wordSection.classList.toggle("fullscreen")
})

buttonUpdateForm.addEventListener("click", () => {
  updateForm.classList.toggle("displaying");
  if(updateForm.classList.contains("displaying")){
    blurDiv.style.display = "flex";
  }
})

function initSingleCard(word, character, trad) {
  let singleCard = `
  <div class="card-container">
  <div class="flip-card">
  <div class="flip-card-inner">
  <div class="flip-card-front">
  <h1 data-table="${word}">${word}</h1>
  </div>
  <div class="flip-card-back">
   <h1>${word}</h1>
   <p>${character}</p>
   <p>${trad}</p>

  </div>
  </div>
  </div>
  <span class="card-buttons">
  <button data-table="${word}" class='delete-input'>Supprimer</button>
  <button data-table="${word}" class='update-input'>Modifier</button>
  </span>
  </div>
  `;
  return singleCard;
}

class Home {
  constructor() {
    this.initSupabase();
    this.getData();
    this.initWord();
  }

  initSupabase() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getData() {
    const { data, error } = await this.supabase.from("kanji").select().order('id', { ascending: true });
    return data;
  }

  async initWord() {
    let words = await this.getData(Promise.resolve);
    words.forEach((element) => {
      let japWord;
      if (element.katakana == null || element.katakana === "") {
        japWord = element.hiragana;
      } else {
        japWord = element.katakana;
      }
      wordSection.innerHTML += initSingleCard(
        element.kanji,
        japWord,
        element.traduction
      );
    });

    let flashcards = document.querySelectorAll(".flip-card");

    flashcards.forEach((card) => {

      card.addEventListener("click", () => {

          card.classList.toggle("active");

    })});

    this.deleteValue();
    this.changeValue();
  }

  deleteValue() {
    let deleteButtons = document.querySelectorAll(".delete-input");
    deleteButtons = Array.from(deleteButtons);
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async() => {
   const response = await this.supabase
  .from('kanji')
  .delete()
  .eq('kanji', button.getAttribute("data-table"))

  setTimeout(() => {
    window.location.reload()
  },300)
      });
    });
  }

  changeValue(){
    
    let updateButtons = document.querySelectorAll(".update-input");

    updateButtons = Array.from(updateButtons);

    updateButtons.forEach((button) => {
     button.addEventListener("click", async () => {
    
    updateForm.classList.toggle("displaying");

/*       let linkWord = button.getAttribute("data-table");
      const { error } = await this.supabase
  .from('kanji')
  .update({ kanji: 'Suicideeeee'})
  .eq('kanji', linkWord) */
     
     })
    })
  
  }
}

let form = document.querySelector(".submit-form");

class Word {
  constructor() {
    this.initSupabase();
    this.getData();
    this.updateValue();
  }

  initSupabase() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  updateValue() {
    form.addEventListener("submit", async (e) => {
      let i = 0;
      e.preventDefault();
      const formData = new FormData(form);

      let instanceValue = [];

      for (const [key, value] of formData) {
        i = i + 1;
        console.log(i, key, value);
        instanceValue.push(value);
      }

      let currentId = await this.getData(Promise.resolve);

      const { error } = await this.supabase.from("kanji").insert({
        id: currentId + 1,
        kanji: instanceValue[0],
        katakana: instanceValue[2],
        hiragana: instanceValue[1],
        romanji: instanceValue[3],
        traduction: instanceValue[4],
        profil_id: 1,
        grammatical_class: instanceValue[5],
      });

      const charValue = this.checkInput(instanceValue[1], instanceValue[2]);
      console.log(charValue);

      wordSection.innerHTML += initSingleCard(
        instanceValue[0],
        charValue,
        instanceValue[4]
      );
    });
  }

  checkInput(hiragana, katakana) {
    let hiraOrKata;

    if (hiragana === "") {
      hiraOrKata = katakana;
    } else {
      hiraOrKata = hiragana;
    }
    console.log(hiraOrKata);
    return hiraOrKata;
  }

  async getData() {
    let ids = [];
    const { data, error } = await this.supabase.from("kanji").select("id");
    for (const value of data) {
      ids.push(value);
    }

    let lastId = ids[ids.length - 1].id;
    return lastId;
  }
}

new Home();

new Word();
