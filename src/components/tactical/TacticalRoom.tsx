'use client'

import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'

interface TargetLabel {
  title: string
  subtitle: string
}

interface TacticalRoomProps {
  onOpenPanel?: (panel: string) => void
  targets?: {
    about: TargetLabel
    tech: TargetLabel
    content: TargetLabel
    contact: TargetLabel
    projects: TargetLabel
  }
  instructions?: {
    move: string
    look: string
    shoot: string
  }
}

function createShootSound(): () => void {
  let audioCtx: AudioContext | null = null
  return () => {
    try {
      if (!audioCtx) audioCtx = new AudioContext()
      const ctx = audioCtx
      const now = ctx.currentTime

      // Short noise burst for subtle gunshot
      const bufferSize = ctx.sampleRate * 0.08
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3)
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.frequency.value = 800
      bandpass.Q.value = 0.5

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      noise.connect(bandpass)
      bandpass.connect(gain)
      gain.connect(ctx.destination)
      noise.start(now)
      noise.stop(now + 0.08)
    } catch {
      // Audio not available
    }
  }
}

export default function TacticalRoom({ onOpenPanel, targets, instructions }: TacticalRoomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const weaponRef = useRef<THREE.Group | null>(null)
  const muzzleFlashRef = useRef<THREE.PointLight | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, ndcX: 0, ndcY: 0 })
  const keysRef = useRef({ w: false, a: false, s: false, d: false })
  const animationRef = useRef<number>(0)
  const isShootingRef = useRef(false)
  const recoilRef = useRef(0)
  const raycasterRef = useRef(new THREE.Raycaster())
  const interactablesRef = useRef<THREE.Mesh[]>([])
  const bulletsRef = useRef<{ mesh: THREE.Mesh; velocity: THREE.Vector3; life: number }[]>([])
  const lastShotTime = useRef(0)
  const hoveredObjectRef = useRef<string | null>(null)
  const playShootSound = useRef(createShootSound()).current

  const createLabelTexture = useCallback((text: string, subtext: string, color: string) => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, 256, 128)
    
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.strokeRect(2, 2, 252, 124)
    
    ctx.fillStyle = color
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(text.toUpperCase(), 128, 50)
    
    ctx.font = '16px Arial'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(subtext, 128, 80)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  const handleShoot = useCallback((target?: THREE.Object3D, direction?: THREE.Vector3) => {
    if (isShootingRef.current || !weaponRef.current || !muzzleFlashRef.current || !cameraRef.current || !sceneRef.current) return
    
    const now = Date.now()
    if (now - lastShotTime.current < 150) return
    lastShotTime.current = now
    
    isShootingRef.current = true
    recoilRef.current = 1
    playShootSound()
    
    muzzleFlashRef.current.intensity = 5
    
    const bullet = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.02, 0.3),
      new THREE.MeshBasicMaterial({ color: '#ffaa00' })
    )
    
    // Use direction from crosshair raycast if provided, otherwise use camera direction
    const bulletDirection = direction || new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRef.current.quaternion)
    
    // Position bullet at weapon muzzle position
    const muzzleOffset = new THREE.Vector3(0.3, -0.2, -0.5).applyQuaternion(cameraRef.current.quaternion)
    bullet.position.copy(cameraRef.current.position).add(muzzleOffset)
    
    // Orient bullet to match direction
    bullet.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), bulletDirection)
    
    const bulletVelocity = bulletDirection.clone().multiplyScalar(2.5)
    
    sceneRef.current.add(bullet)
    bulletsRef.current.push({ mesh: bullet, velocity: bulletVelocity, life: 30 })
    
    if (target?.userData?.panelType && onOpenPanel) {
      console.log('Opening:', target.userData.panelType)
      onOpenPanel(target.userData.panelType)
    }
    
    setTimeout(() => { isShootingRef.current = false }, 50)
    setTimeout(() => { if (muzzleFlashRef.current) muzzleFlashRef.current.intensity = 0 }, 30)
  }, [onOpenPanel])

  const handleClick = useCallback(() => {
    if (!cameraRef.current || !sceneRef.current) return
    
    // Use mouse NDC position for raycast (matches crosshair position exactly)
    raycasterRef.current.setFromCamera(new THREE.Vector2(mouseRef.current.ndcX, mouseRef.current.ndcY), cameraRef.current)
    const intersects = raycasterRef.current.intersectObjects(interactablesRef.current)
    
    // Get direction from raycast (where crosshair is pointing)
    const direction = raycasterRef.current.ray.direction.clone()
    
    if (intersects.length > 0) {
      const object = intersects[0].object
      console.log('Hit:', object.userData.panelType)
      handleShoot(object, direction)
    } else {
      handleShoot(undefined, direction)
    }
  }, [handleShoot])

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0a0a0b')
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 2, 5)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance'
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(1)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
    scene.add(ambientLight)

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshBasicMaterial({ color: '#1a1a2e' })
    )
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)

    // Create targets
    const createTarget = (x: number, z: number, color: string, panelType: string, title: string, subtext: string) => {
      const group = new THREE.Group()
      group.position.set(x, 0, z)

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 2, 0.15, 6),
        new THREE.MeshBasicMaterial({ color: '#2a2a3e' })
      )
      base.position.y = 0.075
      scene.add(base)

      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 2.5, 0.5),
        new THREE.MeshBasicMaterial({ color: '#0a0a0a' })
      )
      pillar.position.set(0, 1.5, 0)
      pillar.userData = { panelType, label: title }
      group.add(pillar)
      interactablesRef.current.push(pillar)

      const glow = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2.3, 0.1),
        new THREE.MeshBasicMaterial({ color })
      )
      glow.position.set(0, 1.5, 0.3)
      group.add(glow)

      const light = new THREE.PointLight(color, 1, 8)
      light.position.set(0, 3, 2)
      group.add(light)

      const labelTex = createLabelTexture(title, subtext, color)
      const label = new THREE.Mesh(
        new THREE.PlaneGeometry(3.5, 1.8),
        new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, side: THREE.DoubleSide })
      )
      label.position.set(0, 4, 0)
      group.add(label)

      pillar.userData.glow = glow
      pillar.userData.originalColor = color

      scene.add(group)
    }

    // 5 targets
    const t = targets || {
      about: { title: 'EXPERIENCIA', subtitle: 'Perfil del Operador' },
      tech: { title: 'STACK TÉCNICO', subtitle: 'Equipo y Habilidades' },
      content: { title: 'CONTENIDO', subtitle: 'Archivos de Intel' },
      contact: { title: 'CONTACTO', subtitle: 'Comunicaciones' },
      projects: { title: 'PROYECTOS', subtitle: 'Archivos de Misión' },
    }
    createTarget(-6, -2, '#00ff41', 'about', t.about.title, t.about.subtitle)
    createTarget(6, -2, '#00d4ff', 'tech', t.tech.title, t.tech.subtitle)
    createTarget(-3.5, -7, '#ff6b00', 'content', t.content.title, t.content.subtitle)
    createTarget(3.5, -7, '#ff0040', 'contact', t.contact.title, t.contact.subtitle)
    createTarget(0, -9, '#ffd700', 'projects', t.projects.title, t.projects.subtitle)

    // Weapon
    const weaponGroup = new THREE.Group()
    weaponRef.current = weaponGroup

    const gunBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.15, 0.35),
      new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.8, roughness: 0.2 })
    )
    weaponGroup.add(gunBody)

    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8),
      new THREE.MeshStandardMaterial({ color: '#4a4a4a', metalness: 0.9, roughness: 0.1 })
    )
    barrel.rotation.x = Math.PI / 2
    barrel.position.set(0, 0.02, -0.3)
    weaponGroup.add(barrel)

    const grip = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.2, 0.12),
      new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.8 })
    )
    grip.position.set(0, -0.12, 0.08)
    grip.rotation.x = 0.2
    weaponGroup.add(grip)

    const triggerGuard = new THREE.Mesh(
      new THREE.TorusGeometry(0.04, 0.008, 4, 12, Math.PI),
      new THREE.MeshStandardMaterial({ color: '#2a2a2a', metalness: 0.7 })
    )
    triggerGuard.rotation.z = Math.PI
    triggerGuard.position.set(0, -0.05, 0.05)
    weaponGroup.add(triggerGuard)

    const sight = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.04, 0.02),
      new THREE.MeshBasicMaterial({ color: '#00ff00' })
    )
    sight.position.set(0, 0.1, -0.05)
    weaponGroup.add(sight)

    const laser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.08, 6),
      new THREE.MeshBasicMaterial({ color: '#ff0000' })
    )
    laser.rotation.x = Math.PI / 2
    laser.position.set(0.03, -0.02, -0.15)
    weaponGroup.add(laser)

    const muzzleFlash = new THREE.PointLight('#ffaa00', 0, 3)
    muzzleFlash.position.set(0, 0.02, -0.5)
    weaponGroup.add(muzzleFlash)
    muzzleFlashRef.current = muzzleFlash

    scene.add(weaponGroup)

    // Crosshair - follows mouse
    const crosshair = document.createElement('div')
    crosshair.id = 'tactical-crosshair'
    crosshair.style.cssText = `
      position: fixed; pointer-events: none; z-index: 100;
      width: 40px; height: 40px; transform: translate(-50%, -50%);
    `
    crosshair.innerHTML = `
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" stroke="#00ff41" stroke-width="1.5" fill="none"/>
        <line x1="20" y1="2" x2="20" y2="14" stroke="#00ff41" stroke-width="2"/>
        <line x1="20" y1="26" x2="20" y2="38" stroke="#00ff41" stroke-width="2"/>
        <line x1="2" y1="20" x2="14" y2="20" stroke="#00ff41" stroke-width="2"/>
        <line x1="26" y1="20" x2="38" y2="20" stroke="#00ff41" stroke-width="2"/>
        <circle cx="20" cy="20" r="2.5" fill="#ff0000"/>
      </svg>
    `
    document.body.appendChild(crosshair)

    // Instructions
    const instructionsEl = document.createElement('div')
    instructionsEl.id = 'tactical-instructions'
    instructionsEl.style.cssText = `
      position: fixed; bottom: 20px; left: 20px;
      color: #00ff41; font-family: monospace; font-size: 14px;
      background: rgba(0,0,0,0.7); padding: 15px; border: 1px solid #00ff41;
      z-index: 100; pointer-events: none;
    `
    const inst = instructions || { move: 'Moverse libremente', look: 'Mirar', shoot: 'Disparar' }
    instructionsEl.innerHTML = `
      <div><b>WASD</b> - ${inst.move}</div>
      <div><b>MOUSE</b> - ${inst.look}</div>
      <div><b>CLICK</b> - ${inst.shoot}</div>
    `
    document.body.appendChild(instructionsEl)

    // Events
    window.addEventListener('mousedown', handleClick)

    const handleMouseMove = (e: MouseEvent) => {
      // Store normalized device coordinates (-1 to +1) for raycast
      mouseRef.current.ndcX = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.ndcY = -(e.clientY / window.innerHeight) * 2 + 1
      // Also store for camera rotation
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 1.2
      // Move crosshair with mouse
      const crosshairEl = document.getElementById('tactical-crosshair')
      if (crosshairEl) {
        crosshairEl.style.left = e.clientX + 'px'
        crosshairEl.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === 'w' || key === 'arrowup') keysRef.current.w = true
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = true
      if (key === 's' || key === 'arrowdown') keysRef.current.s = true
      if (key === 'd' || key === 'arrowright') keysRef.current.d = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === 'w' || key === 'arrowup') keysRef.current.w = false
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = false
      if (key === 's' || key === 'arrowdown') keysRef.current.s = false
      if (key === 'd' || key === 'arrowright') keysRef.current.d = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animation
    const animate = () => {
      if (!cameraRef.current || !weaponRef.current) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const camera = cameraRef.current
      const weapon = weaponRef.current

      camera.rotation.y = -mouseRef.current.x
      camera.rotation.x = -mouseRef.current.y * 0.5

      // SMOOTHER movement with higher speed
      const moveSpeed = 0.15
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
      forward.y = 0
      forward.normalize()
      
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
      right.y = 0
      right.normalize()

      if (keysRef.current.w) {
        camera.position.x += forward.x * moveSpeed
        camera.position.z += forward.z * moveSpeed
      }
      if (keysRef.current.s) {
        camera.position.x -= forward.x * moveSpeed
        camera.position.z -= forward.z * moveSpeed
      }
      if (keysRef.current.a) {
        camera.position.x -= right.x * moveSpeed
        camera.position.z -= right.z * moveSpeed
      }
      if (keysRef.current.d) {
        camera.position.x += right.x * moveSpeed
        camera.position.z += right.z * moveSpeed
      }

      // Bigger bounds
      camera.position.x = Math.max(-45, Math.min(45, camera.position.x))
      camera.position.z = Math.max(-45, Math.min(45, camera.position.z))
      camera.position.y = 2

      weapon.position.copy(camera.position)
      weapon.rotation.copy(camera.rotation)
      weapon.translateZ(-0.5)
      weapon.translateY(-0.2)
      weapon.translateX(0.3)

      if (recoilRef.current > 0) {
        weapon.translateZ(recoilRef.current * 0.1)
        weapon.translateY(recoilRef.current * 0.03)
        recoilRef.current *= 0.8
        if (recoilRef.current < 0.01) recoilRef.current = 0
      }

      // Hover detection from crosshair position (mouse NDC)
      raycasterRef.current.setFromCamera(new THREE.Vector2(mouseRef.current.ndcX, mouseRef.current.ndcY), camera)
      const intersects = raycasterRef.current.intersectObjects(interactablesRef.current)
      
      if (intersects.length > 0) {
        const object = intersects[0].object
        const panelType = object.userData.panelType
        
        if (hoveredObjectRef.current !== panelType) {
          hoveredObjectRef.current = panelType
          document.body.style.cursor = 'pointer'
          if (object.userData.glow) {
            (object.userData.glow.material as THREE.MeshBasicMaterial).color.setHex(0xffffff)
          }
        }
      } else {
        if (hoveredObjectRef.current !== null) {
          interactablesRef.current.forEach(obj => {
            if (obj.userData.panelType === hoveredObjectRef.current && obj.userData.glow) {
              (obj.userData.glow.material as THREE.MeshBasicMaterial).color.set(obj.userData.originalColor)
            }
          })
          hoveredObjectRef.current = null
          document.body.style.cursor = 'crosshair'
        }
      }

      if (bulletsRef.current.length > 0 && sceneRef.current) {
        bulletsRef.current = bulletsRef.current.filter(bullet => {
          bullet.mesh.position.add(bullet.velocity)
          bullet.life--
          if (bullet.life <= 0) {
            sceneRef.current!.remove(bullet.mesh)
            bullet.mesh.geometry.dispose()
            return false
          }
          return true
        })
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }

      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousedown', handleClick)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationRef.current)
      document.body.style.cursor = 'default'
      const crosshairEl = document.getElementById('tactical-crosshair')
      if (crosshairEl?.parentNode) crosshairEl.parentNode.removeChild(crosshairEl)
      const instructionsEl = document.getElementById('tactical-instructions')
      if (instructionsEl?.parentNode) instructionsEl.parentNode.removeChild(instructionsEl)
      
      bulletsRef.current.forEach(b => { 
        if (sceneRef.current) sceneRef.current.remove(b.mesh)
        b.mesh.geometry.dispose() 
      })
      
      if (rendererRef.current) rendererRef.current.dispose()
    }
  }, [handleClick, createLabelTexture]) // No hoveredObject dependency!

  return (
    <canvas 
      ref={canvasRef} 
      style={{ width: '100vw', height: '100vh', display: 'block', cursor: 'crosshair' }} 
    />
  )
}
