import { PasswordService } from '../services/passwordService';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { TipoUsuario } from '../models/UserType';
import dotenv from 'dotenv';

dotenv.config();

async function criarAdmin() {
  const senhaHash = await PasswordService.hash('admin123');
  
  const admin = {
    nome: 'Administrador',
    email: 'admin@anbfarma.com',
    senha: senhaHash,
    tipo: TipoUsuario.ADMIN
  };

  const usuarioCriado = await UsuarioRepository.criar(admin);
  
  if (usuarioCriado) {
    console.log('✅ Usuário admin criado com sucesso!');
    console.log('Email:', admin.email);
    console.log('Senha: admin123');
  } else {
    console.log('❌ Erro ao criar usuário admin');
  }
  
  process.exit(0);
}

criarAdmin();
