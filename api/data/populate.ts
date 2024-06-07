import mongoose from "mongoose";

import { User, Meeting } from '.'

mongoose.connect('mongodb://localhost:27017/project')

    .then(() => User.deleteMany())
    .then(() => Meeting.deleteMany())

    .then(() => User.create({ name: 'Heber Sanchez', email: 'heber1989@gmail.com', password: '123qwe123', avatar: null, about: null }))

    .then(user1 => {
        return Promise.all([

            User.create({ name: 'Xavi Gonzalez', email: 'xavi@gmail.com', password: '123qwe123', avatar: null, about: null }),
            User.create({ name: 'Jordi Bachatero', email: 'jordi@gmail.com', password: '123qwe123', avatar: null, about: null }),
            User.create({ name: 'Pere Hernandez', email: 'pere@gmail.com', password: '123qwe123', avatar: null, about: null }),
            User.create({ name: 'Judit Camps', email: 'judit@gmail.com', password: '123qwe123', avatar: null, about: null }),
            User.create({ name: 'Adri Gordillo', email: 'adri@gmail.com', password: '123qwe123', avatar: null, about: null }),
            User.create({ name: 'Manuel Barzi', email: 'manuel@gmail.com', password: '123qwe123', avatar: null, about: null }),
            User.create({ name: 'Frank', email: 'frank@gmail.com', password: '123qwe123', avatar: null, about: null }),
            User.create({ name: 'Lorena Sanchez', email: 'lorena@gmail.com', password: '123qwe123', avatar: null, about: null }),
            User.create({ name: 'Miky Guevara', email: 'miky@gmail.com', password: '123qwe123', avatar: null, about: null })
        ])
            .then(([user2, user3, user4, user5, user6, user7, user8, user9, user10]) => {
                return Meeting.create({ author: user1._id, title: 'Asadito', address: 'Corbera de Llobregat',
                location: [41.3752827972332, 2.1480333604674424],
                date: new Date().toISOString(),
                description: 'Asadito, viste, todo, post bootcamp',
                image: 'https://www.infobae.com/new-resizer/WU5rIcVWzsRSYVPdDD7s-GvPggM=/filters:format(webp):quality(85)/s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2018/08/09173312/asado.jpg',
                attendees: [user1.id, user2.id, user3.id, user4.id, user5.id, user6.id, user7.id, user8.id, user9.id, user10.id] })
            })
    })
    .then(() => mongoose.disconnect())
    .then(() => console.log('populated'))
    .catch(console.error);


