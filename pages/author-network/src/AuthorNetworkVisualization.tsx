import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface Author {
  name: string;
  id: string;
}

interface Relationship {
  source: string;
  target: string;
  strength: number;
}

interface Props {
  authors: Author[];
  relationships: Relationship[];
}

const AuthorNetworkVisualization: React.FC<Props> = ({ authors, relationships }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    svg.selectAll('*').remove();

    const simulation = d3
      .forceSimulation(authors)
      .force(
        'link',
        d3.forceLink(relationships).id((d: any) => d.id),
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .selectAll('line')
      .data(relationships)
      .enter()
      .append('line')
      .attr('stroke-width', d => Math.sqrt(d.strength))
      .attr('stroke', '#999');

    const node = svg
      .append('g')
      .selectAll('circle')
      .data(authors)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#69b3a2');

    node.append('title').text(d => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
    });
  }, [authors, relationships]);

  return <svg ref={svgRef}></svg>;
};

export default AuthorNetworkVisualization;
