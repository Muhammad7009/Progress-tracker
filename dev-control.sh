GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'


echo -e "${YELLOW}================================${NC}"
echo -e "${GREEN}PROGRESS TRAcKER _ LOCAL DEVOPS TOOL${NC}"
echo -e "${YELLOW}=================================${NC}"

if ! docker info > /dev/null 2>&1;then
    echo -e "${RED} X error: Docker daemon is not running! ${NC}"
    echo -e  "${YELLOW} Please Launch Docker Desktop on Windows , then re-run.${NC}"
    exit 1
fi
echo "Select an automation task:"
echo "1) Fresh Start (Down, Prune Cache, and Rebuild)"
echo "2) Quick Launch (Start existing containers)"
echo "3) Shutdown (Stop and clean up containers)"
echo "4) Health Check & Live Logs"
echo "5) Make a push to github.com"
read -p "Enter choice [1-4]: " CHOICE

case $CHOICE in 
    1)
        echo -e "${YELLOW} Executing Fresh Start ...${NC}"
        echo "Stopping old instances"
        docker compose down
        echo "Flushing dangling docker ghost caches...."
        docker compose prune -f --volumes
        echo " Building and launnching containers in dectached mode..."
        docker compose up -d --build 
        echo "${GREEN} System re built successfully ${NC}"
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
        echo -e "${YELLOW}Streaming logs (Press Ctrl+C to exit)...${NC}"
        docker compose logs -f
        ;;
    5)
        echo "Updating Git hub...."
        read -p "Write the commit message: " comit
        git add .
        git  commit -m "${comit}"
        git push
        echo "${GREEN}Everything is up to date at github.com.${NC}"
    ;;
    *)
        echo -e "${RED}Invalid selection. Exiting.${NC}"
        exit 1
        ;;
esac
        
