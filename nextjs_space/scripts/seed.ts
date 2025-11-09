
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user (role 1)
  const adminPassword = await bcrypt.hash('johndoe123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'Administrador',
      password: adminPassword,
      role: 1,
    },
  })

  // Create regular user (role 2)
  const userPassword = await bcrypt.hash('user123', 10)
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@biblioteca.com' },
    update: {},
    create: {
      email: 'user@biblioteca.com',
      name: 'Usuário Comum',
      password: userPassword,
      role: 2,
    },
  })

  // Create books with the images we fetched
  const books = [
    {
      title: 'O Pequeno Príncipe',
      author: 'Antoine de Saint-Exupéry',
      description: 'Uma fábula sobre a importância da imaginação, amizade e amor. O pequeno príncipe viaja por planetas e nos ensina sobre a natureza humana.',
      cover_image_url: 'https://m.media-amazon.com/images/I/61TBYDakwQL._AC_UF1000,1000_QL80_.jpg',
      total_copies: 4,
      available_copies: 4,
    },
    {
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      description: 'Romance clássico que narra a história de Bentinho e sua obsessão por Capitu, explorando temas como ciúme e traição.',
      cover_image_url: 'https://m.media-amazon.com/images/I/51ibTQtfibL._AC_UF1000,1000_QL80_.jpg',
      total_copies: 4,
      available_copies: 4,
    },
    {
      title: 'Capitães da Areia',
      author: 'Jorge Amado',
      description: 'História de meninos de rua em Salvador, retratando a realidade social e a luta pela sobrevivência na Bahia.',
      cover_image_url: 'https://m.media-amazon.com/images/I/41058a6k-mL._AC_UF1000,1000_QL80_.jpg',
      total_copies: 4,
      available_copies: 4,
    },
    {
      title: 'O Cortiço',
      author: 'Aluísio Azevedo',
      description: 'Obra naturalista que retrata a vida em um cortiço carioca, mostrando as condições sociais do final do século XIX.',
      cover_image_url: 'https://m.media-amazon.com/images/I/51B+5syoTAL._AC_UF1000,1000_QL80_.jpg',
      total_copies: 4,
      available_copies: 4,
    },
    {
      title: 'Senhora',
      author: 'José de Alencar',
      description: 'Romance urbano que critica os casamentos por interesse, narrando a história de Aurélia Camargo.',
      cover_image_url: 'https://m.media-amazon.com/images/I/81qMOu5ExKL._AC_UF1000,1000_QL80_.jpg',
      total_copies: 4,
      available_copies: 4,
    },
    {
      title: 'Iracema',
      author: 'José de Alencar',
      description: 'Lenda do Ceará que conta a história de amor entre a índia Iracema e o português Martim.',
      cover_image_url: 'https://m.media-amazon.com/images/I/41r0GJTChvL._AC_UF1000,1000_QL80_.jpg',
      total_copies: 4,
      available_copies: 4,
    },
    {
      title: 'Memórias Póstumas de Brás Cubas',
      author: 'Machado de Assis',
      description: 'Romance inovador narrado por um defunto, que critica a sociedade brasileira do século XIX com humor e ironia.',
      cover_image_url: 'https://m.media-amazon.com/images/I/417Bq1L6YSL._AC_UF1000,1000_QL80_.jpg',
      total_copies: 4,
      available_copies: 4,
    },
    {
      title: 'A Moreninha',
      author: 'Joaquim Manuel de Macedo',
      description: 'Primeiro romance urbano brasileiro, retrata os costumes da sociedade carioca com uma história de amor juvenil.',
      cover_image_url: 'https://m.media-amazon.com/images/I/71P6H2vSsEL._AC_UF1000,1000_QL80_.jpg',
      total_copies: 4,
      available_copies: 4,
    },
  ]

  for (const book of books) {
    // Check if book already exists
    const existingBook = await prisma.book.findFirst({
      where: { title: book.title }
    })

    if (!existingBook) {
      await prisma.book.create({
        data: book
      })
    }
  }

  console.log('Database seeded successfully!')
  console.log(`Created admin user: ${admin.email}`)
  console.log(`Created regular user: ${regularUser.email}`)
  console.log(`Created ${books.length} books`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
