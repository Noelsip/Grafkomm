from OpenGL.GL import *
from OpenGL.GLUT import *
from OpenGL.GLU import *
import math

# Parameter yang bisa diatur
obj_distance = 0.6  # Jarak benda ke cermin
obj_width = 0.15  # Lebar handphone
obj_height = -0.3  # Tinggi handphone
focus_distance = -0.3  # Jarak titik fokus dari cermin (negatif untuk cembung)
obj_y = 0.0  # Posisi objek menempel di atas sumbu X

def calculate_image():
    global image_distance, image_width, image_height, image_y
    if obj_distance != 0:
        image_distance = 1 / ((1 / focus_distance) + (1 / obj_distance))
        magnification = image_distance / obj_distance
        image_width = obj_width * abs(magnification)
        image_height = -obj_height * abs(magnification)
        image_y = 0.0  # Bayangan tetap menempel di atas sumbu X
        
        # Bayangan harus berada di belakang cermin (koordinat X positif)
        if image_distance > 0:
            image_distance = abs(image_distance)
    else:
        image_distance = 0
        image_width = obj_width
        image_height = obj_height
        image_y = 0.0

calculate_image()

# Fungsi untuk menggambar sumbu koordinat dan titik fokus
def draw_axes():
    glColor3f(1, 1, 1)
    glBegin(GL_LINES)
    glVertex2f(-1, 0)
    glVertex2f(1, 0)
    glVertex2f(0, -1)
    glVertex2f(0, 1)
    glEnd()
    
    # Titik fokus
    glColor3f(1, 1, 0)
    glPointSize(5)
    glBegin(GL_POINTS)
    glVertex2f(focus_distance, 0)
    glEnd()

# Fungsi untuk menggambar garis cahaya utama
def draw_light_rays():
    glColor3f(0, 1, 1)
    glBegin(GL_LINES)
    
    # Sinar datang sejajar sumbu x (dipantulkan seolah-olah dari fokus)
    glVertex2f(-obj_distance, -obj_y)
    glVertex2f(0, obj_y)
    glVertex2f(0, obj_y)
    glVertex2f(1, obj_y - (obj_y - 0) / 2)
    
    # Sinar melalui titik fokus (dipantulkan sejajar sumbu x)
    glVertex2f(-obj_distance, obj_y)
    glVertex2f(focus_distance, 0)
    glVertex2f(focus_distance, 0)
    glVertex2f(1, 0)
    
    # Sinar menuju pusat kelengkungan (dipantulkan kembali ke jalur semula)
    curvature_center = 2 * focus_distance
    glVertex2f(-obj_distance, -obj_y)
    glVertex2f(curvature_center, obj_y)
    glVertex2f(curvature_center, obj_y)
    glVertex2f(-obj_distance, obj_y)
    
    glEnd()

# Fungsi untuk menggambar cermin cekung
def draw_mirror():
    glColor3f(0, 0, 1)
    glLineWidth(2)
    glBegin(GL_LINE_STRIP)
    for i in range(-50, 51):  # Menggambar busur lingkaran
        angle = (i / 100.0) * math.pi
        x = -0.2 * math.cos(angle)
        y = 0.5 * math.sin(angle)
        glVertex2f(x, y)
    glEnd()

# Fungsi untuk menggambar handphone dan bayangannya
def draw_phone(x, y, width, height, mirrored=False):
    glColor3f(1, 0, 0) if mirrored else glColor3f(0, 1, 0)
    
    glBegin(GL_QUADS)
    glVertex2f(x, y)
    glVertex2f(x + width, y)
    glVertex2f(x + width, y - height)
    glVertex2f(x, y - height)
    glEnd()
    
    glColor3f(0, 0, 0.5)
    glBegin(GL_QUADS)
    glVertex2f(x + 0.02, y - 0.02)
    glVertex2f(x + width - 0.02, y - 0.02)
    glVertex2f(x + width - 0.02, y - height + 0.02)
    glVertex2f(x + 0.02, y - height + 0.02)
    glEnd()
    
    glColor3f(1, 1, 1)
    glBegin(GL_QUADS)
    glVertex2f(x + (width / 2) - 0.02, y - height + 0.03)
    glVertex2f(x + (width / 2) + 0.02, y - height + 0.03)
    glVertex2f(x + (width / 2) + 0.02, y - height + 0.01)
    glVertex2f(x + (width / 2) - 0.02, y - height + 0.01)
    glEnd()

# Fungsi untuk menggambar seluruh adegan
def display():
    glClear(GL_COLOR_BUFFER_BIT)
    glLoadIdentity()
    draw_axes()
    draw_mirror()
    draw_light_rays()
    draw_phone(-obj_distance, obj_y, obj_width, obj_height)
    if image_distance != float('inf'):
        draw_phone(image_distance, image_y, image_width, image_height, mirrored=True)
    glutSwapBuffers()

# Fungsi untuk menangani input keyboard
def keyboard(key, x, y):
    global obj_distance, obj_width, obj_height
    step = 0.05
    if key == b'a':
        obj_distance += step
    elif key == b'd':
        obj_distance -= step
    elif key == b'w':
        obj_width += step / 2
        obj_height += step
    elif key == b's':
        obj_width -= step / 2
        obj_height -= step
    calculate_image()
    glutPostRedisplay()

# Inisialisasi OpenGL
def init():
    glClearColor(0, 0, 0, 1)
    glMatrixMode(GL_PROJECTION)
    glLoadIdentity()
    gluOrtho2D(-1, 1, -1, 1)
    glMatrixMode(GL_MODELVIEW)

def main():
    glutInit()
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB)
    glutInitWindowSize(800, 600)
    glutCreateWindow(b"Simulasi Cermin Cembung - Handphone")
    glutDisplayFunc(display)
    glutKeyboardFunc(keyboard)
    init()
    glutMainLoop()

if __name__ == "__main__":
    main()