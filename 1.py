"""Please don't start this until you have:
    * submitted Exercises 3.1 to 3.8
    * completed the Planning for Graphical User Interface
    * reviewed the Ethical Computer Use assignment
"""
# Start your code here
import pygame as pg
import sys
import random

pg.init()
WIDTH = 400
HEIGHT = 700
SIZE = (WIDTH, HEIGHT)
YELLOW = (180, 180, 0)

screen = pg.display.set_mode(SIZE)
screen.fill((180, 180, 180))

enemyXstartPosition = [-10, 135, 265]

carX = 125
carY = 500

enemyCar1 = pg.image.load("vecteezy_top-view-of-blue-car_52643674.png") 
enemyCar1 = pg.transform.scale(enemyCar1, (150, 150))
enemyCar1 = pg.transform.rotate(enemyCar1, 180)
screen.blit(enemyCar1, (125, 170))

enemyCar2 = pg.image.load("vecteezy_sport-car-isolated-on-transparent-background-3d-rendering_19069339.png") 
enemyCar2 = pg.transform.scale(enemyCar2, (160, 150))
enemyCar2 = pg.transform.rotate(enemyCar2, -90)
screen.blit(enemyCar2, (-20, 270))

enemyCars = [enemyCar1, enemyCar2]

font = pg.font.SysFont('DejaVu Sans', 40)

strip_line1 = [pg.Rect(55, (y-2)*100, 10, 60) for y in range(9)]  
strip_line2 = [pg.Rect(195, (y-2)*100, 10, 60) for y in range(9)]  
strip_line3 = [pg.Rect(335, (y-2)*100, 10, 60) for y in range(9)]  

clock = pg.time.Clock()

myCar = pg.image.load("carMy.png") 
myCar = pg.transform.scale(myCar, (150, 150))

flag = False

ds = 5
speed = 100

cont = 0
randCar = 0
enemyX = 0
enemyY = -100

while True:
    screen.fill((60, 180, 60))
    pg.draw.rect(screen, (120, 120, 120), [10, 0, 100, 700], 0)
    pg.draw.rect(screen, (120, 120, 120), [150, 0, 100, 700], 0)
    pg.draw.rect(screen, (120, 120, 120), [290, 0, 100, 700], 0)
    

    
    dt = clock.tick(60) / 1000
    speed += ds * dt
    cont += speed*dt
    
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
    cont += 1
    if cont >= 140 and not flag:
        randPos = random.randint(0, 2)
        randCar = random.randint(0, 1)
        cont = 0
        enemyY = -100
        enemyX = enemyXstartPosition[randPos]
        flag = True
    if flag:
        screen.blit(enemyCars[randCar], (enemyX, enemyY)) 
        enemyY += speed*dt
        if enemyY > HEIGHT:
            flag = False
    
    if enemyX == round(carX) and enemyY == round(carY):
        print("LOSE")
    #print(f"Y{enemyY} = {carY}")
    #print(f"X{enemyX} = {carX}")
    
    myCarNew = myCar#variable for turning
        
    if carX <= -40:#border (left, right)
        carX = -40
    elif carX >= 290:
        carX = 290
        
    pg.event.get()
    pressed_keys = pg.key.get_pressed()
    
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
    pg.draw.rect(screen, (0, 0, 0), [305, 180, 70, 30], 0)  
    text = font.render("yes", True, (255, 0, 0))
    
    
    myRect = myCar.get_rect()
    enemy0Rect = enemyCars[1].get_rect()
    pg.draw.rect(screen, (255,0,0), myRect)
    
   # print(myRect)
    print(enemy0Rect)
    
    pg.display.update()