
function deleteAlumno(id){
  socket.emit('delete', id);
}

function addOrEdit(id){
  var params = {};
  [...$('.fieldForm')].forEach(f=> params[f.name] = f.value );
  if(id) socket.emit('add', params);
  else socket.emit('update', Object.assign({}, params, {_id:id}));
}


function updateList(){
  socket.emit('update list');
}


socket.on('update list', (alumnos)=>{
  console.log('llego la lista: ', alumnos);
  alumnos.forEach(a=>{
    var el = $('<tr>');
    el.append($('<td>').append('<a href="/alumno/'+a._id+'">'+a.curp+'</a>'));
    el.append($('<td>').text(a.fname) );
    el.append($('<td>').text(a.lname) );
    el.append($('<td>').text(a.dob) );
    el.append($('<td>').text(a.added) );
      /*<td>
        <a href="/edit/{{this._id}}">Edit</a>
        <button onclick="deleteAlumno('{{this._id}}')">Delete</button>

      </td>*/

      $('#listUI').append(el);
  });
});

socket.on('show nofication', function(msg){
  alert(msg);
});



$('document').ready(function(){
  updateList();
})
