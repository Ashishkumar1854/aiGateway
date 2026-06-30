#!/bin/bash

# ═══════════════════════════════════════════════════════════════
#  AiGateway — Project Manager Script
#  Usage: ./aigw.sh [start|stop|restart|status|logs|help]
# ═══════════════════════════════════════════════════════════════

set -e

# ── Colors ───────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Project Root ──────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── Banner ────────────────────────────────────────────────────
print_banner() {
  echo ""
  echo -e "${CYAN}${BOLD}  ╔══════════════════════════════════════════╗"
  echo -e "  ║        AiGateway — Project Manager      ║"
  echo -e "  ╚══════════════════════════════════════════╝${RESET}"
  echo ""
}

# ── Helper Functions ──────────────────────────────────────────
log_info()    { echo -e "  ${BLUE}ℹ${RESET}  $1"; }
log_success() { echo -e "  ${GREEN}✔${RESET}  $1"; }
log_warn()    { echo -e "  ${YELLOW}⚠${RESET}  $1"; }
log_error()   { echo -e "  ${RED}✖${RESET}  $1"; }
log_step()    { echo -e "\n${BOLD}  ──── $1 ────${RESET}"; }

# ── Check Docker ──────────────────────────────────────────────
check_docker() {
  if ! command -v docker &>/dev/null; then
    log_error "Docker not found. Please install Docker Desktop first."
    exit 1
  fi
  if ! docker info &>/dev/null 2>&1; then
    log_error "Docker is not running. Please start Docker Desktop."
    exit 1
  fi
}

# ── Check .env ────────────────────────────────────────────────
check_env() {
  if [ ! -f ".env" ]; then
    log_warn ".env file not found. Copying from .env.example..."
    if [ -f ".env.example" ]; then
      cp .env.example .env
      log_success ".env created from .env.example — please fill in your API keys."
    else
      log_error ".env.example not found either. Create a .env file manually."
      exit 1
    fi
  fi
}

# ── Activate n8n Send Email Workflow ─────────────────────────
activate_n8n_workflow() {
  log_info "Activating n8n Send Email workflow..."
  sleep 3
  docker-compose exec -T n8n n8n import:workflow --input=/workflows/send_email.json &>/dev/null || true
  docker-compose exec -T postgres psql -U postgres -d aigw \
    -c "UPDATE n8n.workflow_entity SET active = true WHERE id = 'LLPQmXL6UVr0x8hv'" &>/dev/null || true
}

# ══════════════════════════════════════════════════════════════
#  START
# ══════════════════════════════════════════════════════════════
cmd_start() {
  print_banner
  check_docker
  check_env

  log_step "Starting AiGateway Services"

  # Pull latest images if needed
  log_info "Starting all Docker containers..."
  docker-compose up -d --remove-orphans 2>&1 | grep -E "Started|Created|healthy|error" || true

  log_step "Waiting for Services to be Healthy"

  # Wait for postgres
  log_info "Waiting for PostgreSQL..."
  for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres -d aigw &>/dev/null 2>&1; then
      log_success "PostgreSQL is ready"
      break
    fi
    sleep 2
  done

  # Wait for backend
  log_info "Waiting for Backend API..."
  for i in {1..30}; do
    if curl -sf http://localhost:5001/health &>/dev/null; then
      log_success "Backend API is ready"
      break
    fi
    sleep 3
  done

  # Wait for n8n
  log_info "Waiting for n8n..."
  for i in {1..20}; do
    if curl -sf http://localhost:5678 &>/dev/null; then
      log_success "n8n is ready"
      break
    fi
    sleep 3
  done

  # Activate the Send Email workflow in n8n
  activate_n8n_workflow

  log_step "All Services Started"

  echo ""
  echo -e "${GREEN}${BOLD}  ✅  AiGateway is running!${RESET}"
  echo ""
  echo -e "  ${BOLD}Service URLs:${RESET}"
  echo -e "  ${CYAN}🌐  Public Web        ${RESET}→  http://localhost:3000"
  echo -e "  ${CYAN}👤  Client Dashboard  ${RESET}→  http://localhost:3001"
  echo -e "  ${CYAN}🛠   Admin Dashboard   ${RESET}→  http://localhost:3002"
  echo -e "  ${CYAN}⚙️   Backend API       ${RESET}→  http://localhost:5001"
  echo -e "  ${CYAN}🔁  n8n Automation    ${RESET}→  http://localhost:5678"
  echo ""
  echo -e "  ${BOLD}Useful Commands:${RESET}"
  echo -e "  ${YELLOW}./aigw.sh status${RESET}   — Check service health"
  echo -e "  ${YELLOW}./aigw.sh logs${RESET}     — Stream live logs"
  echo -e "  ${YELLOW}./aigw.sh stop${RESET}     — Stop all services"
  echo ""
}

# ══════════════════════════════════════════════════════════════
#  STOP
# ══════════════════════════════════════════════════════════════
cmd_stop() {
  print_banner
  check_docker

  log_step "Stopping AiGateway Services"
  docker-compose down
  log_success "All services stopped."
  echo ""
}

# ══════════════════════════════════════════════════════════════
#  RESTART
# ══════════════════════════════════════════════════════════════
cmd_restart() {
  print_banner
  check_docker

  log_step "Restarting AiGateway Services"
  docker-compose down
  log_success "Services stopped."
  sleep 2
  cmd_start
}

# ══════════════════════════════════════════════════════════════
#  STATUS
# ══════════════════════════════════════════════════════════════
cmd_status() {
  print_banner
  check_docker

  log_step "Service Health Check"
  echo ""

  services=(
    "aigw_postgres:PostgreSQL DB"
    "aigw_redis:Redis Cache"
    "aigw_backend:Backend API"
    "aigw_public_web:Public Web"
    "aigw_client_dashboard:Client Dashboard"
    "aigw_admin_dashboard:Admin Dashboard"
    "aigw_n8n:n8n Automation"
    "aigw_nginx:Nginx Proxy"
    "aigw_ai_workers:AI Workers"
  )

  for entry in "${services[@]}"; do
    container="${entry%%:*}"
    label="${entry##*:}"
    status=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null || echo "not_found")
    health=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}N/A{{end}}' "$container" 2>/dev/null || echo "")

    if [ "$status" = "running" ]; then
      if [ "$health" = "healthy" ] || [ "$health" = "N/A" ]; then
        echo -e "  ${GREEN}✔${RESET}  ${BOLD}${label}${RESET}  (${status})"
      else
        echo -e "  ${YELLOW}~${RESET}  ${BOLD}${label}${RESET}  (${status} / health: ${health})"
      fi
    elif [ "$status" = "not_found" ]; then
      echo -e "  ${RED}✖${RESET}  ${BOLD}${label}${RESET}  (not running)"
    else
      echo -e "  ${RED}✖${RESET}  ${BOLD}${label}${RESET}  (${status})"
    fi
  done

  echo ""
  echo -e "  ${BOLD}Quick Access:${RESET}"
  echo -e "  🌐  http://localhost:3000  (Public Web)"
  echo -e "  👤  http://localhost:3001  (Client Dashboard)"
  echo -e "  🛠   http://localhost:3002  (Admin Dashboard)"
  echo -e "  ⚙️   http://localhost:5001  (Backend API)"
  echo -e "  🔁  http://localhost:5678  (n8n)"
  echo ""
}

# ══════════════════════════════════════════════════════════════
#  LOGS
# ══════════════════════════════════════════════════════════════
cmd_logs() {
  print_banner
  local service="${2:-}"
  if [ -n "$service" ]; then
    log_info "Streaming logs for: $service (Ctrl+C to stop)"
    docker-compose logs -f "$service"
  else
    log_info "Streaming logs for all services (Ctrl+C to stop)"
    log_info "Tip: ./aigw.sh logs backend   — to see only backend logs"
    echo ""
    docker-compose logs -f
  fi
}

# ══════════════════════════════════════════════════════════════
#  REBUILD
# ══════════════════════════════════════════════════════════════
cmd_rebuild() {
  print_banner
  check_docker
  check_env

  log_step "Rebuilding AiGateway (Full Rebuild)"
  log_warn "This will rebuild all Docker images from scratch..."
  echo ""
  read -p "  Are you sure? (y/N): " confirm
  if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    log_info "Cancelled."
    exit 0
  fi

  docker-compose down
  docker-compose build --no-cache
  cmd_start
}

# ══════════════════════════════════════════════════════════════
#  RESET (Nuclear option — wipes all data)
# ══════════════════════════════════════════════════════════════
cmd_reset() {
  print_banner
  check_docker

  log_warn "⚠️  This will DELETE ALL DATA including the database!"
  echo ""
  read -p "  Are you absolutely sure? Type 'yes' to confirm: " confirm
  if [ "$confirm" != "yes" ]; then
    log_info "Cancelled."
    exit 0
  fi

  log_step "Performing Full Reset"
  docker-compose down -v
  log_success "All containers and volumes removed."
  log_info "Run ./aigw.sh start to start fresh."
  echo ""
}

# ══════════════════════════════════════════════════════════════
#  HELP
# ══════════════════════════════════════════════════════════════
cmd_help() {
  print_banner
  echo -e "  ${BOLD}Usage:${RESET}  ./aigw.sh <command> [service]"
  echo ""
  echo -e "  ${BOLD}Commands:${RESET}"
  echo -e "  ${CYAN}start${RESET}          Start all services"
  echo -e "  ${CYAN}stop${RESET}           Stop all services"
  echo -e "  ${CYAN}restart${RESET}        Stop and start all services"
  echo -e "  ${CYAN}status${RESET}         Show health of all services"
  echo -e "  ${CYAN}logs [service]${RESET} Stream logs (optional: service name)"
  echo -e "  ${CYAN}rebuild${RESET}        Rebuild Docker images from scratch"
  echo -e "  ${CYAN}reset${RESET}          ⚠️  Wipe all data and start fresh"
  echo -e "  ${CYAN}help${RESET}           Show this help message"
  echo ""
  echo -e "  ${BOLD}Service Names (for logs):${RESET}"
  echo -e "  backend, public-web, client-dashboard, admin-dashboard,"
  echo -e "  n8n, postgres, redis, nginx, ai-workers"
  echo ""
  echo -e "  ${BOLD}Examples:${RESET}"
  echo -e "  ${YELLOW}./aigw.sh start${RESET}"
  echo -e "  ${YELLOW}./aigw.sh logs backend${RESET}"
  echo -e "  ${YELLOW}./aigw.sh status${RESET}"
  echo ""
}

# ══════════════════════════════════════════════════════════════
#  MAIN ENTRYPOINT
# ══════════════════════════════════════════════════════════════
COMMAND="${1:-help}"

case "$COMMAND" in
  start)    cmd_start ;;
  stop)     cmd_stop ;;
  restart)  cmd_restart ;;
  status)   cmd_status ;;
  logs)     cmd_logs "$@" ;;
  rebuild)  cmd_rebuild ;;
  reset)    cmd_reset ;;
  help|--help|-h) cmd_help ;;
  *)
    log_error "Unknown command: $COMMAND"
    cmd_help
    exit 1
    ;;
esac
