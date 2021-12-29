function rand(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get(id)
{
	return document.getElementById(id)
}

function removeByIndex(str,index) {
      return str.slice(0,index) + str.slice(index+1);
}
