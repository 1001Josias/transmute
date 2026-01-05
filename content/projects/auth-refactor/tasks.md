---
project_id: "auth-refactor"
prd_version: "1.0"
created_at: "2026-01-05"
updated_at: "2026-01-05"
---

# Tasks: Refatorar Sistema de Autenticação

## Task 1: Implementar OAuth2
- **id:** task-001
- **status:** done
- **priority:** high
- **description:** Implementar autenticação OAuth2 com providers externos Google e GitHub.

### Subtasks

#### [x] Configurar provider Google
Registrar aplicação no Google Cloud Console, configurar OAuth consent screen e obter credenciais client_id/client_secret.

#### [x] Configurar provider GitHub
Registrar OAuth App nas configurações do GitHub e implementar callback handler para troca de código por token.

#### [ ] Adicionar testes de integração
Criar testes end-to-end para validar fluxo completo de autenticação com mocks dos providers.

---

## Task 2: Implementar MFA
- **id:** task-002
- **status:** in_progress
- **priority:** high
- **description:** Adicionar autenticação multi-fator para maior segurança dos usuários.

### Subtasks

#### [x] Design da UI do modal MFA
Criar mockups no Figma e implementar componentes React do modal de verificação com input de 6 dígitos.

#### [ ] Implementar TOTP backend
Instalar biblioteca otplib, criar endpoints para geração de secret, QR code, e validação de códigos TOTP.

#### [ ] Implementar SMS como fallback
Integrar com Twilio para envio de códigos via SMS quando usuário não tiver app authenticator configurado.

---

## Task 3: Gestão de Sessões
- **id:** task-003
- **status:** todo
- **priority:** medium
- **description:** Permitir usuários visualizarem e revogarem suas sessões ativas em outros dispositivos.

### Subtasks

#### [ ] Criar página de sessões ativas
Implementar UI listando todas as sessões com informações de device, localização aproximada e última atividade.

#### [ ] Implementar revogação de sessão
Adicionar botão para revogar sessões específicas ou todas as outras sessões exceto a atual.

#### [ ] Notificação de novo login
Enviar email ao usuário quando um novo login for detectado de um dispositivo/localização não reconhecida.
