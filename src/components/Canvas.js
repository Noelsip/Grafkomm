/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react'

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function point(x, y) {
    return new Point(x,y)
}

export default function Canvas(props) {
    const canvasRef = useRef(null)

    function draw_line(ctx, start, end, strokeColor) {
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.strokeStyle = strokeColor
        ctx.stroke()
    }

    function ddaX(x1, y1, x2, y2){
        let x
        let steps
        let dx = x2 - x1
        let dy = y2 - y1

        steps = Math.max(Math.abs(dx), Math.abs(dy))
        let xIncrement = dx / steps;
        x = x1
        for (let i = 0; i < 2000; i++){
            x += xIncrement
        }
        return x
    }

    function ddaY(x1, y1, x2, y2){
        let y
        let steps
        let dx = x2 - x1
        let dy = y2 - y1

        steps = Math.max(Math.abs(dx), Math.abs(dy))
        let yIncrement = dy / steps;
        y = y1
        for (let i = 0; i < 2000; i++){
            y += yIncrement
        }
        return y
    }

    const draw = ctx => {
        const jarakBenda = props.jarakBenda
        const tinggiBenda = props.tinggiBenda
        const titikFokus = props.titikFokus
        const setJarakBayangan = props.setJarakBayangan
        const setTinggiBayangan = props.setTinggiBayangan

        const titikX = ctx.canvas.width / 2
        const titikY = ctx.canvas.height / 2

        const hasilJarakBayangan = jarakBenda * titikFokus / (jarakBenda - titikFokus)
        const hasilTinggiBayangan = hasilJarakBayangan * tinggiBenda / jarakBenda
        
        setJarakBayangan(hasilJarakBayangan)
        setTinggiBayangan(hasilTinggiBayangan)

        const bendaX = titikX - jarakBenda
        const bendaY = titikY - tinggiBenda

        const bayanganX = titikX - hasilJarakBayangan
        const bayanganY = titikY + hasilTinggiBayangan

        const x = bendaX
        const y = bendaY

        let titikBayanganX = 0
        if (hasilJarakBayangan < 0) {
            titikBayanganX = 1000
        } 

        //Cartesian Plane
        draw_line(ctx, point(titikX, 0), point(titikX, ctx.canvas.width), 'black')
        draw_line(ctx, point(0, titikY), point(ctx.canvas.height, titikY), 'black')
        //Object
        draw_line(ctx, point(x, titikY), point(x, y), 'red')
        //Reflection
        draw_line(ctx, point(bayanganX, titikY), point(bayanganX, bayanganY), 'purple')
        //Cahaya Datang
        draw_line(ctx, point(0, bendaY), point(titikX, bendaY), 'orange')
        draw_line(ctx, point(titikX, bayanganY), point(ddaX(titikX, bayanganY, bendaX, bendaY, true), ddaY(titikX, bayanganY, bendaX, bendaY, true)), 'orange')
        
        //Cahaya Lewat
        draw_line(ctx, point(titikBayanganX, bayanganY), point(titikX, bayanganY), 'blue')
        draw_line(ctx, point(titikX, bendaY), point(ddaX(titikX, bendaY, bayanganX, bayanganY), ddaY(titikX, bendaY, bayanganX, bayanganY)), 'blue')
        
        //Pensil
        if (jarakBenda > 0 && tinggiBenda > 0) {
            draw_line(ctx, point(bendaX-10, bendaY), point(bendaX+10, bendaY), 'green')
            draw_line(ctx, point(bendaX-10, bendaY), point(bendaX-10, titikY-10), 'yellow')
            draw_line(ctx, point(bendaX-10, titikY-10), point(bendaX, titikY), 'green')
            draw_line(ctx, point(bendaX+10, bendaY), point(bendaX+10, titikY-10), 'green')
            draw_line(ctx, point(bendaX + 10, titikY - 10), point(bendaX, titikY), 'green')
            draw_line(ctx, point(bendaX - 20, bendaY), point(bendaX - 20, bendaY - 10), 'black')
            draw_line(ctx, point(bendaX-20, bendaY), point(bendaX-20, bendaY-10), 'black')


            
    
            //Bayangan
            draw_line(ctx, point(bayanganX-10, bayanganY), point(bayanganX+10, bayanganY), 'yellow')
            if (hasilJarakBayangan < 0 ) {
                draw_line(ctx, point(bayanganX-10, bayanganY), point(bayanganX-10, titikY-10), 'yellow')
                draw_line(ctx, point(bayanganX+10, bayanganY), point(bayanganX+10, titikY-10), 'yellow')
                draw_line(ctx, point(bayanganX-10, titikY-10), point(bayanganX, titikY), 'yellow')
                draw_line(ctx, point(bayanganX+10, titikY-10), point(bayanganX, titikY), 'yellow')  
            } if (hasilJarakBayangan > 0 ) {
                draw_line(ctx, point(bayanganX-10, bayanganY), point(bayanganX-10, titikY+10), 'yellow')
                draw_line(ctx, point(bayanganX+10, bayanganY), point(bayanganX+10, titikY+10), 'yellow')
                draw_line(ctx, point(bayanganX-10, titikY+10), point(bayanganX, titikY), 'yellow')
                draw_line(ctx, point(bayanganX+10, titikY+10), point(bayanganX, titikY), 'yellow')
            }
        }
    }
    
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height);
        draw(context)
    }, [draw])
    
    return (
    <canvas className="flex w-screen h-screen border-4 bg-zinc-900 rounded-lg" width="1000" height='1000' ref={canvasRef} {...props}/>
    )
}