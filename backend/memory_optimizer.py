#!/usr/bin/env python3
"""
Memory Optimization Utility for Sneaker Authentication API
This script helps manage memory usage and provides monitoring capabilities.
"""

import os
import gc
import psutil
import time
import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MemoryOptimizer:
    def __init__(self):
        self.process = psutil.Process()
        self.memory_threshold = 400 * 1024 * 1024  # 400MB threshold
        
    def get_memory_info(self) -> Dict[str, Any]:
        """Get current memory usage information"""
        try:
            memory_info = self.process.memory_info()
            memory_percent = self.process.memory_percent()
            
            return {
                'rss_mb': memory_info.rss / (1024 * 1024),  # Resident Set Size
                'vms_mb': memory_info.vms / (1024 * 1024),  # Virtual Memory Size
                'percent': memory_percent,
                'available_system_mb': psutil.virtual_memory().available / (1024 * 1024),
                'total_system_mb': psutil.virtual_memory().total / (1024 * 1024)
            }
        except Exception as e:
            logger.error(f"Error getting memory info: {e}")
            return {}
    
    def force_garbage_collection(self) -> Dict[str, Any]:
        """Force garbage collection and return memory freed"""
        try:
            # Get memory before GC
            memory_before = self.get_memory_info()
            
            # Force garbage collection
            collected = gc.collect()
            
            # Get memory after GC
            memory_after = self.get_memory_info()
            
            # Calculate memory freed
            memory_freed = 0
            if memory_before and memory_after:
                memory_freed = memory_before.get('rss_mb', 0) - memory_after.get('rss_mb', 0)
            
            logger.info(f"Garbage collection completed. Objects collected: {collected}")
            logger.info(f"Memory freed: {memory_freed:.2f} MB")
            
            return {
                'objects_collected': collected,
                'memory_freed_mb': max(0, memory_freed),
                'memory_before': memory_before,
                'memory_after': memory_after
            }
            
        except Exception as e:
            logger.error(f"Error during garbage collection: {e}")
            return {}
    
    def check_memory_usage(self) -> Dict[str, Any]:
        """Check if memory usage is within acceptable limits"""
        try:
            memory_info = self.get_memory_info()
            
            if not memory_info:
                return {'status': 'error', 'message': 'Could not get memory info'}
            
            rss_mb = memory_info.get('rss_mb', 0)
            percent = memory_info.get('percent', 0)
            
            # Check against thresholds
            is_high_memory = rss_mb > self.memory_threshold / (1024 * 1024)
            is_high_percent = percent > 80
            
            status = 'normal'
            if is_high_memory or is_high_percent:
                status = 'warning'
            if rss_mb > 450 * 1024 * 1024 / (1024 * 1024):  # 450MB
                status = 'critical'
            
            return {
                'status': status,
                'rss_mb': rss_mb,
                'percent': percent,
                'threshold_mb': self.memory_threshold / (1024 * 1024),
                'is_high_memory': is_high_memory,
                'is_high_percent': is_high_percent,
                'recommendation': self._get_recommendation(status, rss_mb, percent)
            }
            
        except Exception as e:
            logger.error(f"Error checking memory usage: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def _get_recommendation(self, status: str, rss_mb: float, percent: float) -> str:
        """Get recommendation based on memory status"""
        if status == 'critical':
            return "Immediate action required: Restart service or optimize memory usage"
        elif status == 'warning':
            return "Consider running garbage collection or optimizing memory usage"
        else:
            return "Memory usage is within normal limits"
    
    def optimize_memory(self) -> Dict[str, Any]:
        """Perform comprehensive memory optimization"""
        try:
            logger.info("Starting memory optimization...")
            
            # Check current memory
            initial_check = self.check_memory_usage()
            logger.info(f"Initial memory status: {initial_check}")
            
            # Force garbage collection
            gc_result = self.force_garbage_collection()
            
            # Wait a bit for memory to stabilize
            time.sleep(1)
            
            # Check memory after optimization
            final_check = self.check_memory_usage()
            
            # Calculate improvement
            improvement = 0
            if (initial_check.get('rss_mb') and final_check.get('rss_mb')):
                improvement = initial_check['rss_mb'] - final_check['rss_mb']
            
            result = {
                'initial_status': initial_check,
                'gc_result': gc_result,
                'final_status': final_check,
                'memory_improvement_mb': max(0, improvement),
                'optimization_successful': improvement > 0
            }
            
            logger.info(f"Memory optimization completed. Improvement: {improvement:.2f} MB")
            return result
            
        except Exception as e:
            logger.error(f"Error during memory optimization: {e}")
            return {'error': str(e)}
    
    def monitor_memory(self, interval: int = 60, duration: int = 3600):
        """Monitor memory usage over time"""
        logger.info(f"Starting memory monitoring for {duration} seconds with {interval}s intervals")
        
        start_time = time.time()
        monitoring_data = []
        
        try:
            while time.time() - start_time < duration:
                memory_info = self.get_memory_info()
                memory_check = self.check_memory_usage()
                
                monitoring_data.append({
                    'timestamp': time.time(),
                    'memory_info': memory_info,
                    'memory_check': memory_check
                })
                
                logger.info(f"Memory: {memory_info.get('rss_mb', 0):.2f} MB, Status: {memory_check.get('status', 'unknown')}")
                
                # Sleep for interval
                time.sleep(interval)
                
        except KeyboardInterrupt:
            logger.info("Memory monitoring stopped by user")
        
        return monitoring_data

def main():
    """Main function for command line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Memory Optimization Utility')
    parser.add_argument('--check', action='store_true', help='Check current memory usage')
    parser.add_argument('--optimize', action='store_true', help='Perform memory optimization')
    parser.add_argument('--monitor', action='store_true', help='Monitor memory usage')
    parser.add_argument('--interval', type=int, default=60, help='Monitoring interval in seconds')
    parser.add_argument('--duration', type=int, default=3600, help='Monitoring duration in seconds')
    
    args = parser.parse_args()
    
    optimizer = MemoryOptimizer()
    
    if args.check:
        result = optimizer.check_memory_usage()
        print(f"Memory Check Result: {result}")
    
    if args.optimize:
        result = optimizer.optimize_memory()
        print(f"Memory Optimization Result: {result}")
    
    if args.monitor:
        data = optimizer.monitor_memory(args.interval, args.duration)
        print(f"Monitoring completed. Collected {len(data)} data points.")

if __name__ == "__main__":
    main()
