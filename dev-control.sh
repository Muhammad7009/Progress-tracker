#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' 


echo -e "${YELLOW}=========================================${NC}"
echo -e "${GREEN}    PROGRESS TRACKER - LOCAL DEVOPS TOOL ${NC}"
echo -e "${YELLOW}=========================================${NC}"

if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker daemon is not running!${NC}"
    echo -e "${YELLOW}👉 Please launch Docker Desktop on Windows first, then re-run.${NC}"
    exit 1
fi


echo "Select an automation task:"
echo "1) Fresh Start (Down, Prune Cache, and Rebuild)"
echo "2) Quick Launch (Start existing containers)"
echo "3) Shutdown (Stop and clean up containers)"
echo "4) Health Check & Live Logs"
echo "5) Make a push to github.com"
read -p "Enter choice [1-5]: " CHOICE

case $CHOICE in
    1)
        echo -e "\n${YELLOW}🔄 Executing Full Reset & Fresh Start...${NC}"
        docker compose down --volumes --remove-orphans
        docker container prune -f
        docker system prune -f --volumes
        # Forcing a completely clean build with no cached layers
        docker compose up -d --build --force-recreate
        echo -e "${GREEN}✅ System rebuilt completely clean!${NC}"
        ;;
    2)
        echo -e "\n${YELLOW}🚀 Launching application containers...${NC}"
        docker compose up -d
        echo -e "${GREEN}✅ App is up!${NC}"
        ;;
    3)
        echo -e "\n${YELLOW}🛑 Shutting down microservices...${NC}"
        docker compose down
        echo -e "${GREEN}✅ Environment turned off safely.${NC}"
        ;;
    4)
        echo -e "\n${YELLOW}🔍 Checking container health statuses...${NC}"
        echo "-----------------------------------------"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo "-----------------------------------------"
        echo -e "${YELLOW}Streaming logs via service names to bypass ghost IDs...${NC}"
        # FIX: We target the service name 'backend' directly instead of letting compose guess the ID
        docker compose logs -f
        ;;
    5)
        echo -e "\n${YELLOW}🐙 Starting Automated Git Push...${NC}"
        # Check git status first
        git status -s
        
        read -p "Enter your commit message: " COMMIT_MSG
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="Automated progress update"
        fi

        echo -e "${YELLOW}Staging files...${NC}"
        git add .
        
        echo -e "${YELLOW}Committing changes...${NC}"
        git commit -m "$COMMIT_MSG"
        
        # Get the current active branch name automatically
        BRANCH=$(git branch --show-current)
        echo -e "${YELLOW}Pushing code to origin/$BRANCH...${NC}"
        if git push origin "$BRANCH"; then
            echo -e "${GREEN}✅ Code successfully pushed to GitHub!${NC}"
        else
            echo -e "${RED}❌ Push failed. Check your network or GitHub permissions.${NC}"
        fi
        ;;
    *)
        echo -e "${RED}Invalid selection. Exiting.${NC}"
        exit 1
        ;;
esac
