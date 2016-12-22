
function deleteAlumno(id){
  socket.emit('delete', id);
}

socket.on('show nofication', function(msg){
  alert(msg);
});
