Тимур Гватемала Информатика, [15.05.2025 22:53]
"""Please don't begin this until you have received your peer feedback!"""

# Start your code here
import pygame as pg
import sys
import random
from urllib.request import urlopen
from io import BytesIO

pg.init()
WIDTH = 400
HEIGHT = 700
SIZE = (WIDTH, HEIGHT)
YELLOW = (180, 180, 0)

screen = pg.display.set_mode(SIZE)
screen.fill((180, 180, 180))
#3 start positions of enemies(3 lines)
enemyXstartPosition = [-10, 135, 265]

carX = 125
carY = 500
#rock 
rock = pg.image.load("rock.png") 
rock = pg.transform.scale(rock, (40, 31))
rockXstartPosition = [110, 250]#250

#enemy cars
enemyCar1 = pg.image.load("afc3922912ff0795839a86cf8c9af343.png") 
enemyCar1 = pg.transform.scale(enemyCar1, (150, 150))
enemyCar1 = pg.transform.rotate(enemyCar1, 180)
screen.blit(enemyCar1, (125, 170))

enemyCar2 = pg.image.load("bcb18072e1930e06ae7f6ed3d26c3b90.png") 
enemyCar2 = pg.transform.scale(enemyCar2, (160, 150))
enemyCar2 = pg.transform.rotate(enemyCar2, -90)
screen.blit(enemyCar2, (-20, 270))

#hearts
heart1 = pg.image.load("heart.png")
heart1 = pg.transform.scale(heart1, (30, 30))
screen.blit(heart1, (260, 100))

heart2 = pg.image.load("heart.png")
heart2 = pg.transform.scale(heart2, (30, 30))
screen.blit(heart2, (300, 100))

heart3 = pg.image.load("heart.png")
heart3 = pg.transform.scale(heart3, (30, 30))
screen.blit(heart3, (340, 100))

hearts = [heart1, heart2, heart3]

enemyCars = [enemyCar1, enemyCar2]
#fonts
font = pg.font.SysFont('DejaVu Sans', 55)
fontScore = pg.font.SysFont('DejaVu Sans', 15)
fontHeart = pg.font.SysFont("DejaVu Sans", 25)

font_data = urlopen("https://codehs.com/uploads/0665649f2835aa2641f52f41749b027a")
font_file = BytesIO(font_data.read())
fontLogo = pg.font.Font(font_file, 60)

font_data2 = urlopen("https://codehs.com/uploads/0665649f2835aa2641f52f41749b027a")
font_file2 = BytesIO(font_data2.read())
fontLogoSmall = pg.font.Font(font_file2, 20)



#generator of lists for 9 yellow lines
strip_line1 = [pg.Rect(55, (y-2)*100, 10, 60) for y in range(9)]  
strip_line2 = [pg.Rect(195, (y-2)*100, 10, 60) for y in range(9)]  
strip_line3 = [pg.Rect(335, (y-2)*100, 10, 60) for y in range(9)]

#gross background
gross1 = pg.image.load("gross.jpeg")
gross2 = pg.image.load("gross.jpeg")
gross3 = pg.image.load("gross.jpeg")

startButton = pg.image.load("play.png")
startButton = pg.transform.scale(startButton , (170, 80))

backGross = [gross1, gross2, gross3]
backPosY = [-1400, -700, 0]

clock = pg.time.Clock()

myCar = pg.image.load("95a029c2cc69339f6b2841a8f832a761.png") 
myCar = pg.transform.scale(myCar, (150, 150))

flag = False

#variables for speed
ds = 5
speed = 100

cont = 0
timer = 0
randCar = 0
enemyX = 0
enemyY = -100
rockIs = False

rockX = 0
rockY = -100
endGame = False
heartsCount = 3

endGameCount = 0
collision = False

start = False

while True:
    dt = clock.tick(60) / 1000
    
    if not endGame and start:
        speed += ds * dt
        cont += speed*dt

    #"for" for gross background
    for i in range(3):
        screen.blit(backGross[i], (0, backPosY[i]))
        backPosY[i] += speed * dt
        if backPosY[i] >= 700:
            backPosY[i] = backPosY[i] - 1400
    #3 grey lines
    pg.draw.rect(screen, (120, 120, 120), [10, 0, 100, 700], 0)
    pg.draw.rect(screen, (120, 120, 120), [150, 0, 100, 700], 0)
    pg.draw.rect(screen, (120, 120, 120), [290, 0, 100, 700], 0)
    
    for i in range(9):
        #1 yellow lines 
        strip_line1[i].y += speed * dt
        if strip_line1[i].y >= 800:
            strip_line1[i].y = strip_line1[i].y - 900
        
        pg.draw.rect(screen, YELLOW, strip_line1[i], 0)
        #2 yellow lines
        strip_line2[i].y += speed * dt
        if strip_line2[i].y >= 800:
            strip_line2[i].y = strip_line2[i].y - 900
        
        pg.draw.rect(screen, YELLOW, strip_line2[i], 0)
        #3 yellow lines
        strip_line3[i].y += speed * dt
        if strip_line3[i].y >= 800:
            strip_line3[i].y = strip_line3[i].y - 900
        
        pg.draw.rect(screen, YELLOW, strip_line3[i], 0)

Тимур Гватемала Информатика, [15.05.2025 22:53]
cont += 1
    timer += 1
    #############
    if cont >= 140 and not flag:
        randPos = random.randint(0, 2)
        randCar = random.randint(0, 1)
        cont = 0
        enemyY = -100
        enemyX = enemyXstartPosition[randPos]
        flag = True
    if flag:
        screen.blit(enemyCars[randCar], (enemyX, enemyY)) 
        enemyY += 2*(speed*dt)
        if enemyY > HEIGHT:
            flag = False
    #kamen takzhe kak enemy  
    if timer >= 80 and not rockIs:
        randPosForRock = random.randint(0, 1)
        timer = 0
        rockY = -100
        rockX = rockXstartPosition[randPosForRock]
        rockIs = True
    if rockIs:
        screen.blit(rock, (rockX, rockY))
        rockY += speed*dt
        if rockY > HEIGHT:
            rockIs = False
    
    myCarNew = myCar#variable for turning
        
    if carX <= -40:#border (left, right)
        carX = -40
    elif carX >= 290:
        carX = 290
        
    pg.event.get()
    pressed_keys = pg.key.get_pressed()
    if not endGame and start:
        if pressed_keys[pg.K_RIGHT]:
            carX +=speed*dt
            myCarNew = pg.transform.rotate(myCarNew, -7)
            screen.blit(myCarNew, (carX, carY))
        elif pressed_keys[pg.K_LEFT]:
            carX -=speed*dt
            myCarNew = pg.transform.rotate(myCarNew, 7)
            screen.blit(myCarNew, (carX, carY))
        else:
            screen.blit(myCar, (carX, carY))    
    
    #score
    pg.draw.rect(screen, (0, 0, 0), [0, 20, 400, 30], 0)  
    score = fontScore.render(f"{round(speed)-100}", True, (255,255, 255))
    screen.blit(score, (35,30))
    
    #hearts
    if endGameCount == 0:
        screen.blit(hearts[0], (335, 20))
        screen.blit(hearts[1], (305, 20))
        screen.blit(hearts[2], (275, 20))
    elif endGameCount == 1:
        screen.blit(hearts[0], (335, 20))
        screen.blit(hearts[1], (305, 20))
    elif endGameCount == 2:
        screen.blit(hearts[0], (335, 20))
    elif endGameCount >= 3:
        bgEnd = pg.Surface((WIDTH, HEIGHT))
        bgEnd.fill((60,60,60))
        bgEnd.set_alpha(230)
        screen.blit(bgEnd,(0,0))
        endGame = True
        pg.draw.rect(screen, (0, 0, 0), [30, 250, 340, 250], 0)  
        text = font.render("GAME OVER!", True, (255, 0, 0))
        screen.blit(text, (40, 300))
        text2 = font.render("Your score is:", True, (255, 0, 0))
        screen.blit(text2, (40, 350))
        text3 = font.render(f"{round(speed)-100}", True, (255,255, 255))
        screen.blit(text3, (160, 400))
        

    #phantom figure for tracking collision of my car
    if start:
        myRect = pg.Rect(0, 0, 60, 100)
        myRect.x = carX+50
        myRect.y = carY+20
        
        if (myRect.colliderect(myRectEnemy1) or myRect.colliderect(myRockEnemy)) :
            if not collision:
                endGameCount += 1
                collision = True
        
            if round(pg.time.get_ticks() / 150) % 2 == 0 and endGameCount <= 3:
                hitRect = pg.Surface((WIDTH, HEIGHT))
                hitRect.fill((255,0,0))
                hitRect.set_alpha(128)
                screen.blit(hitRect,(0,0))
        else:
            collision = False
            
        
    #phantom figure for tracking collision of rock
    myRockEnemy = pg.Rect(0, 0, 30, 40)
    myRockEnemy.x = rockX
    myRockEnemy.y = rockY
    #pg.draw.rect(screen, (255, 0, 0), myRockEnemy, 0)
    
    #phantom figure for tracking collision of enemy car
    myRectEnemy1 = pg.Rect(0, 0, 70, 135)
    myRectEnemy1.x = enemyX+40
    myRectEnemy1.y = enemyY+10

Тимур Гватемала Информатика, [15.05.2025 22:53]
if not start:
        bgStart = pg.Surface((WIDTH, HEIGHT))
        bgStart.fill((60,60,60))
        bgStart.set_alpha(128)
        screen.blit(bgStart,(0,0))
        screen.blit(startButton, (115, 280))
        startButtonRect = startButton.get_rect()
        startButtonRect.topleft = (115,280)
        
        #pg.event.get() 
        pressed_keys2 = pg.key.get_pressed()
        pg.draw.rect(screen, (255,0,0), startButtonRect, 0)
        for event in pg.event.get():
            if event.type == pg.MOUSEBUTTONDOWN:
                print("CLICK!")
                if startButtonRect.collidepoint(event.pos):
                    start = True
                    endGame = 0
  
                    
            elif event.type == pg.KEYDOWN:
                if event.key == pg.K_RETURN:
                    start = True
                    endGame = 0
        
        logo = fontLogo.render("Mad Max", True, (0, 238, 83))
        logoRect = logo.get_rect()
        logoRect.topleft = (60, 160)
        screen.blit(logo, logoRect)
        
        instr = fontLogoSmall.render("Use arrows to control a car!", True, (255, 255, 255))
        screen.blit(instr, (30, 420))
        instr2 = fontLogoSmall.render("Try to avoid contact with enemies", True, (255, 255, 255))
        screen.blit(instr2, (3, 450))

    #TODO: button retry,heal
    
    pg.display.update()