var words = As.concat(Ls);



var word_length = 5
var present = 0;
var correct = 1;
var absent = -1;


// Calculate hints
function get_hints(input, solution)
{
    var a = Array(word_length).fill(absent);
    var t = Array(word_length).fill(true);
    var o = Array(word_length).fill(true);


    // First loop to find correct letters
    for(var i = 0; i <word_length; i++)
    {
      if(input[i] === solution[i])
      {
        a[i] = correct;
        t[i] = false;
        o[i] = false;
      }
    }

    for(var i = 0; i <word_length; i++)
    {
        var letter = input[i];
        if (t[i])
        {
            for(var j = 0; j < word_length; j++)
            {
                var d = solution[j];
                if (o[j] && letter === d)
                {
                    a[i] = present;
                    o[j] = false;
                    break
                }
            }
        }
    }

    return a;
}


// Is the candidate word a plausible solution, given those hints?
function is_plausible(input, hints, candidate)
{

      var remaining = candidate;
      //loop forcorrect letters
      for(var i = 0; i < word_length; i++)
      {
        // If a letter is correct: should be the same in both input/candidate
        // and remove it from the letters to consider forpresent/absent
        if(hints[i] === correct)
        {
          if(input[i] !== candidate[i])
          {
            return 0;
          }
          remaining = removeByIndex(remaining, i);
        }
        //If a letter is not correct: they should be different
        else if(hints[i] !== correct && input[i] === candidate[i])
        {
          return 0;
        }
      }



      //Loop forpresent letters

      for(var i = 0; i < word_length; i++)
      {
          if(hints[i] === present)
          {
            occurence = remaining.indexOf(input[i]);

            if(occurence > -1)
            {
              remaining = removeByIndex(remaining, i);
            }
            else  //If the present letter isn't present => not plausible
            {
              return 0;
            }

          }
      }
      //Absent letters : if a single absent letter is in the remaining : not plausible
      for(var i = 0; i < word_length; i++)
      {
        if(hints[i] === absent)
        {
          occurence = remaining.indexOf(input[i])
          if(occurence > -1)
          {
              return 0;
          }
        }
      }

      return 1;
}


var total_poss = 0;
var is_calculating = false;

function calculate_poss(input, i)
{
    var poss = 0;
    var solution = words[i];
    for(var j = 0; j < words.length; j++)
    {
      var candidate = words[j];
      var hints = get_hints(input, solution);
      poss += is_plausible(input, hints, candidate)
    }
  return poss;
}



var progress_bar_value = 0;
function need_to_update_bar(p)
{
  return p != progress_bar_value;
}

function update_bar(p)
{
  if(p != progress_bar_value)
  {
    progress_bar_value = p;
    get("progress-bar").style.width = p+"%";
  }

}


function slay()
{
  if(is_calculating) return "stop";

  get("score").style.display = "none";

  var input = get("input").value.trim().toLowerCase();
  input = (input+"     ").slice(0,5);

  if(words.indexOf(input) == -1)
  {
    if(!confirm("This word is not in the Wordle dictionnary.\nPress OK to calculate its score anyway."))
    return "stop";
  }


  // Loading calculations
  total_poss = 0;
  is_calculating = true;
  function nextChunk(chunk_index)
  {

    if(chunk_index >= words.length)
    {
      update_bar(100);
      displayResults();
      return "stop";
    }

    var poss = calculate_poss(input, chunk_index);
    total_poss += poss;
    var percentage = Math.floor(100*chunk_index/words.length);

    if(need_to_update_bar(percentage))
    {
      update_bar(percentage);
      // wait a bit
      setTimeout(function(){
        nextChunk(chunk_index+1);
      } ,20);
    }
    else
    {
      nextChunk(chunk_index+1);
    }
  }

  nextChunk(0);
  //Done loading
}


function displayResults()
{
  update_bar(0);
  var score = words.length*words.length-total_poss;
  get("score_value").innerHTML = score;
  get("score").style.display = "inline-block";
  is_calculating = false;
}

// Add Enter shortcut
var input = document.getElementById("input");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("slay_button").click();
  }
});
