'use client'
import { Text } from '@react-three/drei'

export default function Class({
	text,
	color = 'white',
	backgroundColor = 'rgba(0,0,0,0.7)',
	position = [0, 0, 0.05],
	width = 2.5,
	height = 3.5,
}) {
	return (
		<>
			{/* Class background block */}
			<mesh position={[position[0], position[1], position[2] - 0.001]}>
				<planeGeometry args={[width, 0.3]} />
				<meshBasicMaterial
					color={backgroundColor}
					transparent
					opacity={0.8}
				/>
			</mesh>

			{/* Class text */}
			<Text
				position={position}
				fontSize={0.15}
				color={color}
				anchorX='center'
				anchorY='middle'
				maxWidth={width * 0.8}
				textAlign='center'
				outlineWidth={0.02}
				outlineColor='black'
				fontStyle='italic'
			>
				{text}
			</Text>
		</>
	)
}
