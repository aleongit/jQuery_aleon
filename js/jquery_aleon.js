'use strict';

let categories = ["random","animal","career","celebrity","dev","explicit","fashion","food","history","money","movie","music","political","religion","science","sport","travel"];
const TOTAL_PREGUNTES = 10;

//llistar select arra categories chuck
const llista_select = () => {
  categories.forEach( cat => {
    $("#cat_select").append(`<option value=${cat}>${cat}</option>`);
  });
  $('.sms').append('Categories ready<br>');
}

//sortida html imatge
const html_imatge = (img, num) => {
  //console.log(img, num);

  let html = `
  <div class="fakeimg">
    <img src=${img}>
  </div>`;

  $(`#card${num} .mes_info`).append(html);

}

//sortida html paraula diccionari
const html_paraula = (def, num) => {
  //console.log(def, num);

  let html = `
  <div class='dic'>
  <table>
    <tr><td>Paraula</td><td>${def[0].word}</td></tr>
    <tr><td>Fonètica</td><td>${def[0].phonetic}</td></tr>
    <tr><td>Tipus</td><td>${def[0].meanings[0].partOfSpeech}</td></tr>
    <tr><td>Definició</td><td>${def[0].meanings[0].definitions[0].definition}</td></tr>
    <tr><td>Exemple</td><td>${def[0].meanings[0].definitions[0].example}</td></tr>
  </table>
  </div> `;

  $(`#card${num}`).append(`<div class="mes_info"></div`);
  $(`#card${num} .mes_info`).append(html);

  //amaguem div 'mes_info'
  $(`#card${num} .mes_info`).hide()

}

//sortida html frase chuck
const html_chuck = (frase, data, num) => {
  //console.log(frase, data, num);

  let html = `
  <div class = 'frase'>
    <img class = 'img_chuck' src="img/chucknorris_logo_coloured_small@2x.png">
    <p class= 'data_post'>${data}</p>
    <blockquote>
      <p>${frase}</p>
    </blockquote>
    <button>+ INFO</button>
  </div> `;

  $("#chuck").append(`<div id='card${num}' class='card'></div`);
  $(`#card${num}`).append(html);

  //event click a butó
  $(`#card${num} button`).click( () => {
      //alert("* TEST *");
      //console.log($( `#card${num} .mes_info`).text() );
      //si no hi ha més info
      if ( $( `#card${num} .mes_info`).text() === "" ) {
        //console.log("* BUIT *");
        $(`#card${num} button`).text('* NO INFO :(');
        $(`#card${num} button`).css({"background-color": "rgba(201, 0, 0, 0.603)"});
      } 
      $(`#card${num} .mes_info`).toggle();
  })
}

//fetch imatge
const busquem_imatge = (imatge, num) => {
  //console.log(`* BUSQUEM IMATGE ${imatge} A API IMATGES *`);
  //https://imsea.herokuapp.com/api/1?q=putin%20on%20a%20horse

  $('.sms').append('searching imatge: ' + imatge + ' ...<br>');

  //definim
  let errors = "";
  let url_img = `https://api.pexels.com/v1/search?query=${imatge}`;

  fetch(url_img, {
    headers: {
      Authorization: "563492ad6f9170000100000196e53ea526854c35a8aad9122c4de571"
    }
  })
  .then( resposta => {
    //console.log(resposta);
    if ( resposta.ok ) {
        //console.log(resposta.json());
        //.json() ja retorna una promesa
        resposta.json()
        .then(imatges => {
            //agafem llista imatges
            //console.log(imatges);
            let img = imatges.photos[0].src.original
            //console.log(img);
            
            //html paraula diccionari
            html_imatge(img, num)
            //return num;
            })
  
    } else {
        errors += '* FATAL ERROR * http error imatge ' + imatge +'<br>';
        //console.log(errors);
        $('.sms').append(errors);
      }
  })
  .catch( error => {
    errors += '* FATAL ERROR * fetch error imatge ' + imatge + ' :' + error.message + '<br>';
    //console.log(errors);
    $('.sms').append(errors);
  });

  //console.log(errors);
}


//fetch paraula__________________________________________________________
const busquem_paraula = (paraula, num) => {
  //console.log(`* BUSQUEM PARAULA ${paraula} A API DICCIONARI *`);
  //https://api.dictionaryapi.dev/api/v2/entries/en/word

  $('.sms').append('searching chuck norris last word: ' + paraula + ' ...<br>');

  //definim
  let errors = "";
  let url_dic = `https://api.dictionaryapi.dev/api/v2/entries/en/${paraula}`;

  fetch(url_dic)
  .then( resposta => {
    //console.log(resposta);
    if ( resposta.ok ) {
        //console.log(resposta.json());
        //.json() ja retorna una promesa
        resposta.json()
        .then(def => {
            //agafem definició paraula
            //console.log(def)
            //html paraula diccionari
            html_paraula(def, num)
            return paraula;
            })
            .then( paraula => busquem_imatge(paraula, num))
  
    } else {
        errors += '* FATAL ERROR * http error paraula ' + paraula +'<br>';
        //console.log(errors);
        $('.sms').append(errors);
      }
  })
  .catch( error => {
    errors += '* FATAL ERROR * fetch error paraula ' + paraula + ' :' + error.message + '<br>';
    //console.log(errors);
    $('.sms').append(errors);
  });

  //console.log(errors);
}

//fetch chuck_____________________________________________________________
const busquem_chuck = (num) => {

  //inicialitzem
  let errors = "";
  let frase = "";
  
  $("#chuck").empty();
  //$(".sms").empty();

  let url_chuck = `https://api.chucknorris.io/jokes/random`;

  //agafem valor categoria select
  let cat = $("#cat_select").val();
  //console.log(cat);

  //https://api.chucknorris.io/jokes/random
  //https://api.chucknorris.io/jokes/random?category={category}

  //si cat no random
  if ( cat != 'random' ) {
    url_chuck = `https://api.chucknorris.io/jokes/random?category=${cat}`;
  }
  //console.log(url_chuck);

  fetch(url_chuck)
  .then( resposta => {
    //console.log(resposta);
    if ( resposta.ok ) {
        //console.log(resposta.json());
        //.json() ja retorna una promesa
        resposta.json()
        .then(post => {
            //agafem frase chuck
            //console.log(post.value);
            frase = post.value;
            
            //última paraula frase
            let ultima = frase.split(" ").at(-1);
            //console.log(ultima);

            //depurar últim caràcter ('.' normalment)
            if ( ultima.slice(-1) == '.' ) { ultima = ultima.slice(0,-1)};
            //console.log(ultima);

            //agafem data
            let data = post.created_at;
            //console.log(data);

            //format moment data
            moment.locale('ca');
            data = moment(data).format('LLLL');

            //html frase chuck
            html_chuck(frase, data, num);

            //retornem última paraula per 2n fetch encadenat
            return ultima
            })
            .then( ultima => busquem_paraula(ultima, num))
  
    } else {
        errors += '* FATAL ERROR * http error post ' + num +'<br>';
        //console.log(errors);
        $('.sms').append(errors);
      }
  })
  .catch( error => {
    errors += '* FATAL ERROR * fetch error post ' + num + ' :' + error.message + '<br>';
    //console.log(errors);
    $('.sms').append(errors);
  });
  //console.log(errors);
}

//rellotge___________________________________________________________________
const rellotge = () => {

  //dies
  let MESOS = "Gener Febrer Març Abril Maig Juny Juliol Agost Setembre Octubre Novembre Desembre".split(' ');
  let DIES = "Diumenge Dilluns Dimarts Dimecres Dijous Divendres Dissabte".split(' ');
  let D = "DG DL DM DX DJ DV DS".split(' ');

  // agafar hora actual
  let data = new Date();

  // agafem paràmetres
  let hores = data.getHours();
  let minuts = data.getMinutes();
  let segons = data.getSeconds();

  let dia_set = data.getDay();
  let dia_mes = data.getDate();
  let mes = data.getMonth();
  let any = data.getFullYear();
  //console.log(mes);
  //console.log(typeof(mes));

  //omplim zeros si més petit de 10
  if ( hores < 10) { hores = '0' + hores};
  if ( minuts < 10) { minuts = '0' + minuts};
  if ( segons < 10) { segons = '0' + segons};
  if ( dia_mes < 10) { dia_mes = '0' + dia_mes};
  if ( mes < 10) { mes = '0' + mes};
  //console.log(mes);
  //console.log(typeof(mes));

  //ampm
  let ampm = 'PM';
  if ( hores < 12) { ampm = 'AM'};
  //console.log(ampm);

  //hora
  let hora = `${hores}:${minuts}:${segons}`;
  //console.log(hora);

  //dia semana
  let dia_cat = DIES[dia_set];
  let dia_D = D[dia_set];
  //console.log(dia_cat,dia_D);

  //mes
  let mes_cat = MESOS[parseInt(mes)];

  //data
  let data_llarga = `<span>${dia_cat}, ${dia_mes} de ${mes_cat} de ${any}</span>`;
  //console.log(data_llarga);
  
  //sortida html
  //$('.row').html(html);  
  $(`#${dia_D}`).addClass('actiu');
  $('.hora').text(hora);
  $('.ampm').text(ampm);
  $('.data').html(data_llarga);
  
  //fer això cada 'n' segons
  setTimeout( rellotge, 1000 );
}

const missatges = (ok, el, label) => {

  let NORMA_NOM = "Abc, espais, accents, ü, ç, ñ, '.', '·'";
  let NORMA_MAIL = "Abc, 123, '-', '_', '.'', i 1x'@'";
  let NORMA_GEN = '* SELECCIONA OPCIÓ *'
  let NORMA_DATA = "Format data dd/mm/aaaa";
  let norma = '* FATAL ERROR VALIDACIÓ :(*';

  //assignació missatges
  //console.log(el.attr('id'));
  let id = el.attr('id');

  if ( id == 'fnom' || id =='fcognoms') {
    norma = NORMA_NOM;
  } else if ( id == 'fmail' ) {
    norma = NORMA_MAIL;
  } else if ( id == 'fgen' ) {
    norma = NORMA_GEN;
  } else if ( id == 'fdata' ) {
    norma = NORMA_DATA;
  }

  if ( ! ok ) {
    //console.log(label.text());
    label.addClass('error').removeClass('ok').text(norma);
    el.addClass('input_error').removeClass('input_ok');
  } else {
    label.addClass('ok').removeClass('error').text('* OK ;) *');
    el.addClass('input_ok').removeClass('input_error');
  }  
}

//valida form
const valida_form = () => {

  //validacions camps
  //.on per afegir varis esdeveniment si s'escau
  //aprofito camp 'for' de label, que conté 'id' de input

  //validacions nom i cognom _________________________________________________________
  // 'on' per afegir diversos esdeveniments
  $('.vnom').on( {
    
    //al input
    input: function () {
      let nom = $(this).val();
      let label = $('label[for="' + $(this).attr('id') + '"]');
      //var validName = /^[a-zA-Z ]*$/;
      //lletres maj, min, '\s' espais, '/ui' unicode
      let pattern = /^[a-zA-z-.·\s\p{L}]*$/ui;
      
      //envio resultat validació, this: l'input en concret, i el label de l'input
      missatges(pattern.test(nom),$(this),label);
 
    },
      //quan es surt de input
      blur: function () {
        let nom = $(this).val();
        let label = $('label[for="' + $(this).attr('id') + '"]');
        if (! nom.length ) { 
          label.addClass('error').removeClass('ok').text('* OBLIGATORI ! *');
          $(this).addClass('input_error').removeClass('input_ok');
        }
      }
     } );
  
  // valiadació email ________________________________________________________
  $('#fmail').on( {
    
    //al input
    input: function () {
  
      let email = $(this).val();
      let label = $('label[for="' + $(this).attr('id') + '"]');
      let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
      //envio resultat validació, this: l'input en concret, i el label de l'input
      missatges(pattern.test(email),$(this),label);
    },
      //quan es surt de input
      blur: function () {
        let nom = $(this).val();
        let label = $('label[for="' + $(this).attr('id') + '"]');
        if (! nom.length ) { 
          label.addClass('error').removeClass('ok').text('* OBLIGATORI ! *');
          $(this).addClass('input_error').removeClass('input_ok');
        } ;
      }
     } );
  
  // valiadació gènere ________________________________________________________
  $('#fgen').on( {
    
    //al input
    input: function () {
      
      let generes = ['home','dona'];

      let gen = $(this).val();
      let label = $('label[for="' + $(this).attr('id') + '"]');
      //console.log(gen);
  
      //envio resultat validació, this: l'input en concret, i el label de l'input
      missatges(generes.includes(gen),$(this),label);
    }
     } );

  //validació data naixement ________________________________________________
  $('#fdata').on( {
    
    //al input
    change: function () {

      //agafem valors
      let valor = $(this).val();
      let label = $('label[for="' + $(this).attr('id') + '"]');

      //validem si format data dd/mm/aaaa
      let pattern = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;

      //envio resultat validació, this: l'input en concret, i el label de l'input
      missatges(pattern.test(valor),$(this),label);

      //si passa validació format 
      if ( pattern.test(valor) ) {

        //problemes amb format
        //canvio manualment valor dd/mm/aaaa a mm/dd/aaaa
        let dd  = valor.substring(0, 2);
        let mm  = valor.substring(3, 5);
        let aaaa = valor.substring(6, 10);
        //console.log(dd,mm,aaaa);
        
        //passo valor a data
        let data = Date.parse(mm +'/'+ dd +'/'+ aaaa);
        let avui = Date.now();
      
        //console.log(data , avui);

        //no dates futur
        let mesgran = (data > avui);
        //console.log( '*data posterior a avui? ', mesgran );

        //si ok, calcular edat
        if ( !mesgran ) {
          let any_data = new Date(data).getFullYear();
          let any_avui = new Date(avui).getFullYear();

          //fedat
          $('#fedat').val(any_avui - any_data);

          //fdata
          label.addClass('ok').removeClass('error').text('* OK ;) *');
          $(this).addClass('input_ok').removeClass('input_error');

        } else {

          //fedat
          $('#fedat').val("");

          //fdata
          label.addClass('error').removeClass('ok').text('Encara no has nascut ? ;)');
          $(this).addClass('input_error').removeClass('input_ok');
 
          }
      }
    }
  } );
  
  // validació submit, si tots els camps amb classe ok
  $('.input').on('change', function() {

    if ($('#form').find('.input_ok').length == 5) {
  
          $('#buto_form').addClass('btn_ok').removeClass('btn_disabled');
          $('#buto_form').removeAttr('disabled');
      }
    else {
          $('#buto_form').addClass('btn_disabled').removeClass('btn_ok');
          $('#buto_form').attr('disabled','disabled');
          
        }
  });
}

const mostra_fakejson =  person => {

  $('.sms').append('retrieving data...');
 
  $('.fake_dades ul').append(`<img src = '${person.personAvatar}'>`);

  for ( let key in person) {
    let linia = ` . ${key} => ${person[key]}<br>`;
    
    $('.fake_dades ul').append(`<li>${linia}</li>`)
    $('.sms').append(linia);
  }

}

//fakejson
const fakejson = () => {

  //console.log('* click butó form *');
  
  //token i paràmetres fakejson
  let body = {
    token: "_qHBasvOsdYN9f44nwyH5A",
    
    data: {
      "nameFirst": $('#fnom').val(),
      "nameLast": $('#fcognoms').val(),
      personNickname: "personNickname",
      personAvatar: "personAvatar",
      //personGender: "personGender",
      personGender: $('#fgen').val(),
      "internetEmail": $('#fmail').val(),
      personPassword: "personPassword",
      personLanguage: "catalan",
      "dateDOB": $('#fdata').val(),
      "edat": $('#fedat').val(),
      "otherInsult": "otherInsult"
  
      }};
   
  $.ajax({
    method: "POST",
    url: "https://app.fakejson.com/q",
    data: body
    }).done( function(msg) {
      //console.log(msg);
      // mostra fakejson
      $('.fake_dades').prepend('<h2>* Registre OK! ;) *</h2>');
      mostra_fakejson(msg);
      
    })
    .fail(function() {
      //alert( "error" );
      $('.fake_dades').prepend('<h2>* FATAL ERROR REGISTRE :( *</h2>');
    })
}

//joc__________________________________________________________

//click butó next
const change_card = () => {

  //controls
  $('#next_joc').hide();

  //id card activa
  //console.log( $('.card_activa').attr('id') );
  let id = $('.card_activa').attr('id');

  //agafem num div actiu
  let num = id.substring(4, id.length);
  //console.log(num)

  //fins 10 cards

  if ( parseInt(num) < TOTAL_PREGUNTES ) {
    //canvi cards
    //canvi classe card activa
    $(`#card${num}`).hide().removeClass('card_activa');
    $(`#card${parseInt(num)+1}`).show().addClass('card_activa')

    //missatges
    $('.joc_comptador').text(`${parseInt(num)+1} / ${TOTAL_PREGUNTES}`)
    $('.joc_sms').text('* Go Go Go! *');

  } else {
    //joc acabat

    $(`#card${num}`).hide();

    let correctes = $('.res_ok').length;
    let fallades = $('.res_ko').length;
    //console.log(correctes, fallades);
    
    //missatges
    $('.joc_comptador').text(`* GAME OVER *`)
    $('.joc_sms').text(`Encerts: ${correctes} / Errors: ${fallades}`);

    switch (correctes) {
      case TOTAL_PREGUNTES:
        $('#result_emoji').html('&#128526;');
        $('#result_frase').html('UN PERFECT!');
        break;
      case 9: 
        $('#result_emoji').html('&#128513;');
        $('#result_frase').html('GENIAL!');
        break;
      case 8:
      case 7:
        $('#result_emoji').html('&#128516;');
        $('#result_frase').html('MOLT BÉ!');
        break;
      case 6: 
        $('#result_emoji').html('&#128517;');
        $('#result_frase').html('PROU BÉ!');
        break;
      case 5: 
        $('#result_emoji').html('&#128528;');
        $('#result_frase').html('PELS PÈLS!');
        break;
      case 4:
      case 3: 
        $('#result_emoji').html('&#128531;');
        $('#result_frase').html('PÈSSIM!');
        break; 
      case 2:
      case 1: 
        $('#result_emoji').html('&#128565;');
        $('#result_frase').html('LAMENTABLE!');
        break;
      case 0: 
        $('#result_emoji').html('&#128169;');
        $('#result_frase').html('*FATAL JOC*');
        break; 
    }

    //butó again
    $('.controls_joc').css( "text-align", "center" );
    $('#again_joc').show();

  }

}

//click resposta, passem element this
const card_joc =  (el) => {

    //controls
    $('#next_joc').show();

    //id card activa
    //console.log( el.parent().attr('id') )

    //classe de resposta clicada
    //console.log( el.attr('class') )
    let res = el.attr('class')

    if ( res == 'resposta correct_answer' ) {
      el.addClass('res_ok');
      $('.joc_sms').text('OK ANSWER :)')
    } else {
      el.addClass('res_ko');
      $('.joc_sms').text('FATAL ANSWER :(')
    }

    //bloquejar card al clicar 1 cop
    el.parent().addClass('bloqued');
  
}

const html_joc = (preguntes) => {

//console.log(preguntes);
//console.log(preguntes.length);

for (let i=0; i< preguntes.length; i++) {

  //agrupo respostes a array
  let respostes = [ preguntes[i].correct_answer, 
                preguntes[i].incorrect_answers[0],
                preguntes[i].incorrect_answers[1],
                preguntes[i].incorrect_answers[2]];
  //console.log(respostes);

  let canviades = [];

    //canvi ordre respostes
    for (let j=0; j< 4; j++) {
      //índex aleatori de respostes
      //console.log(respostes.length);
      let index = Math.floor(Math.random()*respostes.length);
      //console.log(index);
      //afegir resposta random a nova array canviades
      canviades.push(respostes[index])
      //treure de respostes
      respostes.splice(index,1)
    }
    //console.log('canviades: ' + canviades);

  let html = `            
  <!--card ____________________________________________________________-->
  <div id ='card${i+1}' `;
  
  //classe activa card 1
  if (i == 0) {
    html += `class ='card_joc card_activa'>`;
  } else {
    html += `class ='card_joc'>`;
  }

  //pregunta
  html += `
  <a class='pregunta'>            
    ${preguntes[i].question}
  </a>`;

  //respostes
  for (let j=0; j < canviades.length; j ++) {
    //si és la correcta
    if (canviades[j] == preguntes[i].correct_answer ) {
      html += `<a class='resposta correct_answer'>${canviades[j]}</a>`;
    } else {
      html += `<a class='resposta'>${canviades[j]}</a>`;
    }
  }

  html += `</div>`;
  //console.log(html);
  
  //afegir card (pregunta)
  $('.taulell').append(html);
};

  //amagar cards
  $('.card_joc').hide();

}

//click butó go form
const joc = () => {
  //petició ajax
  //https://opentdb.com/api.php?amount=10&category=22&type=multiple

  //categoria del select
  let cat = $('#select_joc').val();
  //console.log(cat);

  let url = `https://opentdb.com/api.php?amount=10&category=${cat}&type=multiple`;

  $.get( url , function() { 
      //alert( "Load was performed." ) 
    })
    .done( function(preguntes) {
    //console.log(preguntes);
    
    // fer html
    html_joc(preguntes.results);
    
    //ini controls
    $('.form_joc').hide();
    $('#next_joc').hide();
    $('.card_joc').hide()
    $('.taulell').show();

    //missatges
    $('.joc_comptador').text(`1 / ${TOTAL_PREGUNTES}`)
    $('.joc_sms').text('* Go Go Go! *')

    //activa card 1
    $('#card1').show()

    //esdeveniments 
    $('.resposta').click(function() {  
      card_joc( $(this) );             
    });
 
    $('#next_joc').click( () => change_card() );
    
  })
  //TODO_________________________________informar d'error i no deixar jugar
  .fail(function() {
    alert( "* FATAL ERROR API * " );
  })
;}

const default_joc = () => {

  //category 22 = geografia
  //category 21 = esports
  //TODO__________________________ dic categories pel select__________
  
  categories = { 'Cine': '11',
                 'Música': '12',
                 'Ciències':'17',
                 'Informàtica':'18',
                 'Matemàtiques':'19',
                 'Mitologia':'20',
                 'Esports': '21',
                 'Geografia': '22',
                 'Animals':'27'};
  
  //console.log(categories);
  
  //<option value="22">Geografia</option>
  for (let el in categories) {
    //console.log(`${el}: ${categories[el]}`);
    $('#select_joc').append(`<option value="${categories[el]}">${el}</option>`)
  }

  $('.taulell').hide();

  //controls
  $('#again_joc').hide();

}

//canviar fitxer css i guardar estil a storage
const canvi_css = (el) => {
  //console.log( $(el.target).text() );  
  //agafem text element clicat
  let tema = $(el.target).text();
  //evitar link menú de dreta de tot
  if (tema != 'Cap avall ↓') {
    //canvi css
    $('#tema').attr( "href", `css/${tema}.css` );
    $('.sms').append('change theme ok<br>');
    //guardar css a storage
    //comprovem comptabilitat storage
    if ( typeof(Storage) !== 'undefined' ) {
      //console.log('* storage COMPATIBLE *');
      $('.sms').append('storage compatible<br>'); 
      //guarda tema a storage
      localStorage.setItem('tema',tema);
      $('.sms').append('save theme storage ok<br>');
    } else {
      //console.log('* storage NO COMPATIBLE *');
      $('.sms').append('storage incompatible<br>'); 
    }
  }
}

const ini_slider = () => {
  $('.slider').bxSlider(
    {
      auto: true,
      //autoControls: true,
      stopAutoOnClick: true,
      pager: true,
      //slideWidth: 600
    }
  );
  $('.sms').append('slider ready<br>');
}

//inicialitza css
const ini_css = () => {
  //recuperem localStorage
  //si no existeix retorna 'null'
  let tema = localStorage.getItem('tema');
  //console.log(tema);
  if (tema!= null) {
      //canvi css
      $('#tema').attr( "href", `css/${tema}.css` );
      $('.sms').append('load theme storage ok<br>');
    }
  $('.sms').append('CSS ready<br>'); 
}

const pag = (pag) => {
  //console.log(pag);
  //buidem i amaguem
  $('.row').hide();
  //activem pag
  $(`#${pag}`).show();
  $('.sms').append(`pag ${pag} ready<br>`); 

}

//jquery ________________________________________________________
$(document).ready( () => {
    console.log("jQuery ready");
    $('.sms').append('jQuery ready<br>');

    //inicialitzar slider
    ini_slider();

    //inicialitzar llista select
    llista_select();

    //inicialitza css
    ini_css();

    //inicialitza pag
    pag('chuck');

    //canvi pàgines
    $('#cerca_chuck').click ( () => { pag('chuck'); });
    $('#link_clock').click ( () => { pag('clock'); });
    $('#link_form').click ( () => { pag('form'); });
    $('#link_joc').click ( () => { pag('joc'); });

    //links <a> estils, passem element clicat
    $('.estils a').click( (el) => canvi_css( el ) );

    //cap avall
    $(".avall").click( () => {
      //console.log( $('html,body').height() )
      $('body,html').animate({ scrollTop: $('body,html').height() }, 800);
      $('.sms').append('scroll down ok<br>');
      });

    //cap amunt
    $(".amunt").click( () => {
      //console.log( $('html,body').height() )
      $('body,html').animate({ scrollTop: 0 }, 800);
      $('.sms').append('scroll top ok<br>');
      });

    //posts
    $("#cerca_chuck").click( () => {
      //console.log( '* BUSQUEM CHUCK *' );

      //busquem 5 posts
      for ( let i = 0; i < 5; i ++ ) {
         let num = i + 1;
         $('.sms').append('searching chuck norris ' + num + ' ...<br>');
         busquem_chuck( num );
        }
      });

    //rellotge
    rellotge();

    //form
    $( "#fdata" ).datepicker( { "dateFormat": "dd/mm/yy"} );
    valida_form();

    //fakejson
    $("#buto_form").click( () => {
      fakejson();
    });

    //joc__________________________________________________
    //https://opentdb.com/api_config.php
    default_joc();
    $("#go_joc").click( () => joc( ));
             

})


