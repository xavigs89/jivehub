import { readdir, readFile, writeFile } from 'fs/promises'

//Importa las funciones readdir, readFile y writeFile del módulo fs/promises. Estas funciones son versiones asincrónicas de las operaciones de lectura y escritura de archivos del sistema de archivos (filesystem) de Node.js.

readdir('.') //Lee el contenido del directorio actual y devuelve una promesa que se resolverá con una matriz de nombres de archivos en ese directorio.
    .then(files => {
        const jsFiles = files.filter(file => file.endsWith('.js')) 
        //Filtra los nombres de archivos para incluir solo aquellos que terminan con ".js"

        jsFiles.forEach(jsFile => 
            readFile(jsFile, 'utf-8')
                .then(content => {
                    const regex = /^import.*\.\// 
                    //Crea una expresión regular para buscar líneas que comiencen con import seguido de cualquier carácter (.*) y un punto y barra (.\).

                    let newContent = ''

                    let changed = false

                    content.split('\n').forEach(line => {
                        if (regex.test(line)) {
                            newContent += line.replace('\';', '.js\';')

                            changed = true
                        } else newContent += line

                        newContent += '\n'
                    })

                    if (changed)
                        writeFile(jsFile, newContent)
                            .then(() => console.log(`${jsFile} updated`))
                            .catch(console.log)
                })
                .catch(console.log)
        )
    })
    .catch(console.error)