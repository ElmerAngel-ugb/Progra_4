var db_registro = openDatabase('dbregistro', '1.0', 'Sistema de Registro', 5 * 1024 * 1024);
if(!db_registro){
    alert('Disculpa tu navegador no soporta bases de datos locales :(');
}
var app = new Vue({
    el: '#appAlumno',
    data: {
        alumnos: [],
        buscar: '',
        alumno: {
            accion: 'nuevo',
            msg: '',
            idAlumno: '',
            codigo: '',
            nombre: '',
            apellido: '',
            nacimiento: '',
            direccion: '',
            telefono: '',
            correo: '',
            dui: ''
        },
    },
    methods: {
        buscarAlumno(){
            this.obtenerAlumnos(this.buscar);
        },
        guardarAlumno(){
            let sql = '',
                parametros = [];
            if(this.alumno.accion == 'nuevo'){
                sql = 'INSERT INTO alumnos (codigo, nombre, apellido, nacimiento, direccion, telefono, correo, dui) VALUES (?,?,?,?,?,?,?,?)';
                parametros = [this.alumno.codigo,this.alumno.nombre,this.alumno.apellido,this.alumno.nacimiento,this.alumno.direccion,this.alumno.telefono,this.alumno.correo,this.alumno.dui];
            }else if(this.alumno.accion == 'modificar'){
                sql = 'UPDATE alumnos SET codigo=?, nombre=?, apellido=?, nacimiento=?, direccion=?, telefono=?, correo=?, dui=? WHERE idAlumno=?';
                parametros = [this.alumno.codigo,this.alumno.nombre,this.alumno.apellido,this.alumno.nacimiento,this.alumno.direccion,this.alumno.telefono,this.alumno.correo,this.alumno.dui,this.alumno.idAlumno];
            }else if(this.alumno.accion == 'eliminar'){
                sql = 'DELETE FROM alumnos WHERE idAlumno=?';
                parametros = [this.alumno.idAlumno];
            }
            db_registro.transaction(tx=>{
                tx.executeSql(sql,
                    parametros,
                (tx, results)=>{
                    this.alumno.msg = 'Alumno procesado con exito';
                    this.nuevoAlumno();
                    this.obtenerAlumnos();
                },
                (tx, error)=>{
                    this.alumno.msg = `Error al guardar el alumno ${error.message}`;
                });
            });
        },
        modificarAlumno(alumno){
            this.alumno = alumno;
            this.alumno.accion = 'modificar';
        },
        eliminarAlumno(alumno){
            if( confirm(`¿Esta seguro de eliminar el alumno ${alumno.nombre}?`) ){
                this.alumno.idAlumno = alumno.idAlumno;
                this.alumno.accion = 'eliminar';
                this.guardarAlumno();
            }
        },
        obtenerAlumnos(busqueda=''){
            db_registro.transaction(tx=>{
                tx.executeSql(`SELECT * FROM alumnos WHERE nombre like "%${busqueda}%" OR codigo like "%${busqueda}%"`, [], (tx, results)=>{
                    this.alumnos = results.rows;
                });
            });
        },
        nuevoAlumno(){
            this.alumno.accion = 'nuevo';
            this.alumno.idAlumno = '';
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.apellido = '';
            this.alumno.nacimiento = '';
            this.alumno.direccion = '';
            this.alumno.telefono = '';
            this.alumno.correo = '';
            this.alumno.dui = '';
        }
        
    },
    created(){
        db_registro.transaction(tx=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS alumnos(idAlumno INTEGER PRIMARY KEY AUTOINCREMENT, '+
            'codigo char(10), nombre char(75), apellido char(75), nacimiento char(15), direccion TEXT, telefono char(10), correo char(40), dui char(10))');
        }, err=>{
            console.log('Error al crear la tabla alumno', err);
        });
    }
})